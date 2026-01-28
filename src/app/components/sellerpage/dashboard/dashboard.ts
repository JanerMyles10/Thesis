import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/sellerpage';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

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
  orderProduct = '';
  orderQuantity = 1;
  orderTotal = 0;
  // Chat Variables
  contactList: any[] = [];
  currentMessages: any[] = [];
  activeChatUser: any = null;
  replyText: string = '';

  // Interval to auto-refresh notifications
  private refreshInterval: any;

  constructor(private productService: ProductService, ) {}

ngOnInit(): void {
  this.currentUserId = localStorage.getItem('userId');
  if (!this.currentUserId) return;

  this.totalProducts = parseInt(
    localStorage.getItem('sellerProductCount') || '0'
  );

  // ✅ LOAD ORDER COUNT
  this.productService
    .getTotalOrders(this.currentUserId)
    .subscribe(res => {
      this.totalOrders = res.totalOrders;
    });

   this.productService.getTotalProducts(this.currentUserId)
    .subscribe(res => {
      this.totalProducts = res.totalProducts;
    });

  this.loadContacts();
  this.updateUnreadCount();

  this.refreshInterval = setInterval(() => {
    this.loadContacts();
    this.updateUnreadCount();
  }, 3000);
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

  openCreateOrder() {
  const modalEl = document.getElementById('createOrderModal');
  const modal = new bootstrap.Modal(modalEl!);
  modal.show();
}

confirmOrder() {
  if (!this.activeChatUser || !this.currentUserId) return;

  const orderData = {
    sellerId: this.currentUserId,
    buyerId: this.activeChatUser.name,

    productName: this.orderProduct,
    quantity: this.orderQuantity,
    total: this.orderTotal,

    status: 'Completed' // ✅ PURCHASED
  };

  this.productService.createOrder(orderData).subscribe({
    next: () => {
      alert('✅ Item marked as SOLD');

      const modalEl = document.getElementById('createOrderModal');
      bootstrap.Modal.getInstance(modalEl!)?.hide();

      this.orderProduct = '';
      this.orderQuantity = 1;
      this.orderTotal = 0;
    },
    error: () => alert('❌ Failed to save order')
  });
}


}
