import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  // 🔑 Backend API URL
  private apiUrl = 'https://your-backend.com/api/cart'; // replace with your backend URL

  constructor(private http: HttpClient) {
    this.loadCart(); // load localStorage first
    this.loadCartFromBackend(); // then sync with backend if user logged in
  }

  // 🔑 Unique cart key per user
  private getCartKey(): string {
    const userId = localStorage.getItem('userEmail'); // using email as ID
    return userId ? `cart_${userId}` : 'cart_guest';
  }

  // 🧠 Load cart from localStorage
  private loadCart() {
    const key = this.getCartKey();
    const savedCart = localStorage.getItem(key);
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    this.updateCount();
  }

  // 💾 Save cart to localStorage
  private saveCart() {
    const key = this.getCartKey();
    localStorage.setItem(key, JSON.stringify(this.cartItems));
  }

  // 🌐 Sync cart to backend
  private syncCartToBackend() {
    const userId = localStorage.getItem('userEmail');
    if (!userId) return; // guest users don't sync
    this.http.post(`${this.apiUrl}/${userId}`, { items: this.cartItems })
      .subscribe({
        next: () => console.log('Cart synced to backend'),
        error: err => console.error('Failed to sync cart', err)
      });
  }

  // 🌐 Load cart from backend (on login or init)
  private loadCartFromBackend() {
    const userId = localStorage.getItem('userEmail');
    if (!userId) return;

    this.http.get<any[]>(`${this.apiUrl}/${userId}`)
      .subscribe({
        next: items => {
          if (items && items.length) {
            this.cartItems = items;
            this.saveCart(); // update localStorage
            this.updateCount();
          }
        },
        error: err => console.error('Failed to load cart from backend', err)
      });
  }

  // ➕ Add or update item
  addToCart(product: any) {
    const existing = this.cartItems.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      this.cartItems.push(product);
    }
    this.saveCart();
    this.updateCount();
    this.syncCartToBackend();
  }

  // 🔍 Get all cart items
  getCartItems() {
    return this.cartItems;
  }

  // ❌ Remove item from cart
  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter(p => p._id !== item._id);
    this.saveCart();
    this.updateCount();
    this.syncCartToBackend();
  }

  // 🗑 Clear the cart
  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.updateCount();
    this.syncCartToBackend();
  }

  // 🔄 Update total item count
  private updateCount() {
    const totalItems = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
    this.cartCount.next(totalItems);
  }

  // 🔄 Refresh cart on login/logout
  refreshCart() {
    this.loadCartFromBackend();
  }
}
