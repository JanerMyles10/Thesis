import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
    this.loadCart();
  }

  // 🔑 Get a unique cart key per user
  private getCartKey(): string {
    const user = {
      id: localStorage.getItem('userEmail') // 👈 using userEmail as ID since you don’t have user._id saved
    };
    return user && user.id ? `cart_${user.id}` : 'cart_guest';
  }

  // 🧠 Load cart based on logged-in user
  private loadCart() {
    const key = this.getCartKey();
    const savedCart = localStorage.getItem(key);
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    this.updateCount();
  }

  // 💾 Save cart to correct key
  private saveCart() {
    const key = this.getCartKey();
    localStorage.setItem(key, JSON.stringify(this.cartItems));
  }

  addToCart(product: any) {
    const existing = this.cartItems.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      this.cartItems.push(product);
    }
    this.saveCart();
    this.updateCount();
  }

  getCartItems() {
    return this.cartItems;
  }

  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter(p => p._id !== item._id);
    this.saveCart();
    this.updateCount();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.updateCount();
  }

  private updateCount() {
    const totalItems = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
    this.cartCount.next(totalItems);
  }

  // Call this after login/logout to refresh
  refreshCart() {
    this.loadCart();
  }
}
