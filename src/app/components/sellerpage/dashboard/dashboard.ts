import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/sellerpage';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order } from '../../../services/orders';
import { SocketService } from '../../../services/socket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  today: number = Date.now();
  currentUserId: string | null = null;
  totalUnread: number = 0;
  totalOrders: number = 0;
  totalProducts: number = 0;

  // Chat Variables
  contactList: any[] = [];
  currentMessages: any[] = [];
  activeChatUser: any = null;
  replyText: string = '';

  // Interval to auto-refresh notifications
  private refreshInterval: any;

  constructor(private productService: ProductService, private ordersService: OrdersService, private socketService: SocketService) {}

 ngOnInit(): void {
  this.currentUserId = localStorage.getItem('userId');

  if (!this.currentUserId) return;

  // Load once
  this.loadContacts();
  this.updateUnreadCount();

  // 🔥 AUTO-REFRESH CHAT
  this.refreshInterval = setInterval(() => {

    // 1. Update inbox list
    this.loadContacts();

    // 2. Update unread badge
    this.updateUnreadCount();

    // 3. If chat is open, refresh messages
    if (this.activeChatUser) {
      this.productService
        .getChatHistory(this.currentUserId!, this.activeChatUser.id)
        .subscribe(msgs => {
          this.currentMessages = msgs;
          this.scrollToBottom();
        });
    }

  }, 3000); // every 3 seconds
}



  ngOnDestroy(): void {
    // Stop the timer when leaving the dashboard to prevent errors
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  // --- NOTIFICATION LOGIC ---
  updateUnreadCount() {
    if (this.currentUserId) {
      this.productService.getUnreadCount(this.currentUserId).subscribe(res => {
        this.totalUnread = res.count;
      });
    }
  }

  // --- CHAT LOGIC ---
  loadContacts() {
    if (!this.currentUserId) return;

    this.productService.getMyConversations(this.currentUserId).subscribe(messages => {
      const contactsMap = new Map();

      messages.forEach(msg => {
        const isMeSender = msg.senderId === this.currentUserId;
        const otherId = isMeSender ? msg.receiverId : msg.senderId;

        let displayName = "Guest Buyer";
        if (!isMeSender && msg.senderName) {
            displayName = msg.senderName;
        }

        if (!contactsMap.has(otherId)) {
          contactsMap.set(otherId, {
            id: otherId,
            name: isMeSender ? "Guest Buyer" : displayName,
            lastMessage: msg.messageBody,
            lastMessageTime: msg.timestamp,
            unread: 0 // 🔥 Initialize counter
          });
        }

        const contact = contactsMap.get(otherId);
        if (!isMeSender && msg.senderName) {
           contact.name = msg.senderName;
        }
        if (msg.receiverId === this.currentUserId && !msg.isRead) {
            contact.unread++;
        }
      });

      this.contactList = Array.from(contactsMap.values());
    });
  }

  openChat(contact: any) {
    this.activeChatUser = contact;

    if (this.currentUserId) {
      // 1. Mark messages as READ in Backend
      this.productService.markMessagesAsRead(this.currentUserId, contact.id).subscribe(() => {
         this.updateUnreadCount(); // Update global "New" count
      });

      // 2. 🔥 INSTANT FIX: Manually reset the badge to 0 so it disappears immediately
      if (contact.unread > 0) {
          // Subtract this contact's unread messages from the total immediately
          this.totalUnread = Math.max(0, this.totalUnread - contact.unread);

          // Clear this contact's badge
          contact.unread = 0;
      }

      // 3. Load History
      this.productService.getChatHistory(this.currentUserId, contact.id).subscribe(msgs => {
        this.currentMessages = msgs;
        this.scrollToBottom();
      });
    }
  }

  sendReply() {
    if (!this.replyText.trim() || !this.activeChatUser || !this.currentUserId) return;

    const msgData = {
      senderId: this.currentUserId,
      receiverId: this.activeChatUser.id,
      messageBody: this.replyText,
      productId: null,
      productName: null,
      shopName: null
    };

    this.productService.sendMessage(msgData).subscribe(res => {
      this.currentMessages.push({
        senderId: this.currentUserId,
        messageBody: this.replyText,
        timestamp: new Date()
      });
      this.replyText = '';
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById('dashboardMsgContainer');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }
}
