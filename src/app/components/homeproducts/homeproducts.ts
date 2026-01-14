import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

// Services
import { ProductService } from '../../services/sellerpage'; 
import { CartService } from '../../services/cart';

declare var bootstrap: any;

@Component({
  selector: 'app-homeproducts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './homeproducts.html',
  styleUrl: './homeproducts.css'
})
export class Homeproducts implements OnInit, OnDestroy {
  // Product Data
  products: any[] = [];
  cartCount = 0;
  searchTerm: string = '';
  userEmail: string | null = null;
  name: string | null = null;
  currentUserId: string | null = null;
  isSeller: boolean = false; 

  // Selected Product Data
  selectedProduct: any = null;
  selectedQuantity: number = 1;

  // Review & Message Data
  reviewRating: number = 0;
  reviewText: string = '';
  messageText: string = '';

  // Chat Widget Data
  isChatOpen: boolean = false;
  unreadCount: number = 0;
  contactList: any[] = [];
  currentMessages: any[] = [];
  activeChatUser: any = null;
  replyText: string = '';
  
  // Refresh Timer
  private chatInterval: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');
    this.name = localStorage.getItem('name');
    this.currentUserId = localStorage.getItem('userId');

    // 1. Load Chat & Start Polling
    if (this.currentUserId) {
      this.loadContacts();
      
      // Poll every 5 seconds to get new messages/contacts
      this.chatInterval = setInterval(() => {
        // We ONLY call loadContacts. We calculate the unread count inside there.
        // This prevents the "Server says 1, App says 0" conflict.
        this.loadContacts(); 
      }, 5000);
    }

    // 2. Check Seller Status
    if (this.userEmail) {
      this.productService.getShopStatus(this.userEmail).subscribe({
        next: (response: any) => {
          if (response && (response.status === 'Approved' || response.status === 'approved')) {
            this.isSeller = true;
          }
        },
        error: (err) => { this.isSeller = false; }
      });
    }

    // 3. Load Products
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.chatInterval) clearInterval(this.chatInterval);
  }

  // ==========================================
  //  CHAT LOGIC (Fixed Name & Badges)
  // ==========================================

  loadContacts() {
    if (!this.currentUserId) return;

    this.productService.getMyConversations(this.currentUserId).subscribe(messages => {
      const contactsMap = new Map();

      messages.forEach(msg => {
        const isMeSender = msg.senderId === this.currentUserId;
        const otherId = isMeSender ? msg.receiverId : msg.senderId;
        
        // --- 1. NAME FIX: Smart Detection ---
        // We look for ANY message in the thread that contains the Shop Name.
        let potentialName = msg.shopName; 
        
        if (!contactsMap.has(otherId)) {
          // Initialize Contact
          contactsMap.set(otherId, {
            id: otherId,
            name: (potentialName && potentialName !== 'null') ? potentialName : 'Seller', 
            lastMessage: msg.messageBody,
            lastMessageTime: msg.timestamp,
            initial: 'S', // Default initial
            unread: 0
          });
        } 
        
        // Access the existing contact object
        const contact = contactsMap.get(otherId);

        // 🔥 IMPROVED NAME LOGIC:
        // If we found a valid shopName in this message, update the contact name.
        // This ensures if ANY message has "Accethrift", we use it.
        if (potentialName && potentialName !== 'null' && potentialName !== 'undefined') {
            contact.name = potentialName;
        }
        // Update initials based on the best name we have
        contact.initial = contact.name.charAt(0).toUpperCase();

        // --- 2. BADGE FIX: Smart Counting ---
        // Check if I am currently looking at this chat
        const isChattingWithThisPerson = this.activeChatUser && this.activeChatUser.id === otherId;

        // Only count as unread if I am the receiver AND I am NOT looking at the chat
        if (!isChattingWithThisPerson && msg.receiverId === this.currentUserId && !msg.isRead) {
            contact.unread++;
        }
      });

      this.contactList = Array.from(contactsMap.values());
      
      // Update the Global Red Badge based on our calculated list
      this.unreadCount = this.contactList.reduce((sum, c) => sum + c.unread, 0);
    });
  }

  openChat(contact: any) {
    this.activeChatUser = contact;
    
    if(this.currentUserId) {
      // 1. Mark as Read in Backend
      this.productService.markMessagesAsRead(this.currentUserId, contact.id).subscribe();

      // 2. 🔥 INSTANTLY REMOVE BADGE LOCALLY
      if (contact.unread > 0) {
          this.unreadCount = Math.max(0, this.unreadCount - contact.unread);
          contact.unread = 0; 
      }

      // 3. Load Chat History
      this.productService.getChatHistory(this.currentUserId, contact.id).subscribe(msgs => {
        this.currentMessages = msgs;
        this.scrollToBottom();
      });
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.loadContacts();
    }
  }

  backToContacts() {
    this.activeChatUser = null;
    this.loadContacts();
  }

  sendReply() {
    if (!this.replyText.trim() || !this.activeChatUser || !this.currentUserId) return;

    const msgData = {
      senderId: this.currentUserId,
      receiverId: this.activeChatUser.id,
      messageBody: this.replyText,
      productId: null, 
      productName: null,
      shopName: this.activeChatUser.name // Preserve name if replying
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
      const container = document.getElementById('msgContainer');
      if(container) container.scrollTop = container.scrollHeight;
    }, 100);
  }

  // ==========================================
  //  MESSAGE MODAL (From Product)
  // ==========================================
  openMessageModal(product: any) {
    this.selectedProduct = product;
    this.messageText = `Hi, is this ${product.name} still available?`;
    
    const viewModalEl = document.getElementById('viewProductModal');
    if (viewModalEl) {
        const viewModal = bootstrap.Modal.getInstance(viewModalEl);
        if (viewModal) viewModal.hide();
    }

    const msgModal = new bootstrap.Modal(document.getElementById('messageModal'));
    msgModal.show();
  }

  sendMessage() {
    const currentUserId = localStorage.getItem('userId');
    const currentUserName = localStorage.getItem('name');
    
    if (!currentUserId) {
      alert("Please log in to send a message.");
      return;
    }

    const messageData = {
      senderId: currentUserId,
      senderName: currentUserName || 'Valued Customer',
      receiverId: this.selectedProduct.ownerId,
      productId: this.selectedProduct._id,
      productName: this.selectedProduct.name,
      productImage: this.selectedProduct.imageUrl,
      shopName: this.selectedProduct.shopName,
      messageBody: this.messageText
    };

    this.productService.sendMessage(messageData).subscribe({
      next: (res) => {
        this.showToast('Message sent to seller!');
        
        const modalEl = document.getElementById('messageModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        this.isChatOpen = true;
        this.activeChatUser = {
          id: this.selectedProduct.ownerId,
          name: this.selectedProduct.shopName || 'Seller'
        };

        this.currentMessages = []; 
        this.currentMessages.push({
          senderId: this.currentUserId,
          receiverId: this.selectedProduct.ownerId,
          messageBody: this.messageText,
          timestamp: new Date(),
          productName: this.selectedProduct.name,
          productImage: this.selectedProduct.imageUrl
        });

        this.productService.getChatHistory(this.currentUserId!, this.selectedProduct.ownerId).subscribe(msgs => {
           if(msgs.length > 0) this.currentMessages = msgs;
           this.scrollToBottom();
        });

        this.loadContacts();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to send message.');
      }
    });
  }

  // ==========================================
  //  CART & REVIEWS (Standard)
  // ==========================================
  addToCart(product: any) {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    const modal = new bootstrap.Modal(document.getElementById('addToCartModal'));
    modal.show();
  }

  confirmAddToCart() {
    if (this.selectedProduct && this.selectedQuantity > 0) {
      const productToAdd = {
        ...this.selectedProduct,
        quantity: this.selectedQuantity
      };
      this.cartService.addToCart(productToAdd);
      const modalEl = document.getElementById('addToCartModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      this.showToast('Item added to cart!');
    }
  }

  updateCart() { this.router.navigate(['/cart']); }

  viewProduct(product: any) {
    this.selectedProduct = product;
    const modal = new bootstrap.Modal(document.getElementById('viewProductModal'));
    modal.show();
  }

  setRating(star: number) { this.reviewRating = star; }

  submitReview() {
    if (this.reviewRating === 0) { alert("Please select a star rating!"); return; }
    const reviewData = {
      productId: this.selectedProduct._id,
      shopName: this.selectedProduct.shopName,
      rating: this.reviewRating,
      comment: this.reviewText,
      user: this.name || 'Guest User'
    };
    this.productService.addReview(reviewData).subscribe({
      next: (res) => {
        this.showToast('Review submitted!');
        if (!this.selectedProduct.reviews) this.selectedProduct.reviews = [];
        this.selectedProduct.reviews.push({ user: reviewData.user, rating: reviewData.rating, comment: reviewData.comment, date: new Date() });
        const modalEl = document.getElementById('writeReviewModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if(modal) modal.hide();
        this.reviewRating = 0; this.reviewText = '';
      },
      error: (err) => alert('Failed to submit review')
    });
  }

  showToast(message: string) {
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      const toastBody = toastEl.querySelector('.toast-body');
      if (toastBody) toastBody.innerHTML = `<i class="fas fa-check-circle me-2"></i> ${message}`;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

  get filteredProducts() {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.shopName?.toLowerCase().includes(term)
    );
  }
}