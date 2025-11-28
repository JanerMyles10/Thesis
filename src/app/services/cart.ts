import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api'; // backend URL
  private cartItems: any[] = [];

  // Reactive subjects
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart(); // load cart on service init
  }

  // Get user ID: logged-in email or guest ID
  private getUserId(): string {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) return userEmail;

    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = 'guest-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  }

  // Load cart from backend
  loadCart(): void {
    const userId = this.getUserId();
    this.http.get<any[]>(`${this.apiUrl}/cart/${userId}`).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cartItemsSubject.next(this.cartItems); // emit to subscribers
        this.updateCount();
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  // Add item to cart
  addToCart(product: any): Observable<any[]> {
    const userId = this.getUserId();
    return this.http.post<any[]>(`${this.apiUrl}/cart/${userId}`, product)
      .pipe(
        tap(items => {
          this.cartItems = items;
          this.cartItemsSubject.next(this.cartItems);
          this.updateCount();
        })
      );
  }

  // Remove item from cart
 removeFromCart(item: any): Observable<any[]> {
  const userId = this.getUserId();
  return this.http.delete<any[]>(`${this.apiUrl}/cart/${userId}/${item.productId}`)
    .pipe(
      tap(items => {
        this.cartItems = items;
        this.cartItemsSubject.next(this.cartItems);
        this.updateCount();
      })
    );
}


  // Update quantity
  updateQuantity(productId: string, quantity: number): Observable<any[]> {
    const userId = this.getUserId();
    return this.http.patch<any[]>(`${this.apiUrl}/cart/${userId}/${productId}`, { quantity })
      .pipe(
        tap(items => {
          this.cartItems = items;
          this.cartItemsSubject.next(this.cartItems);
          this.updateCount();
        })
      );
  }

  // Clear cart
  clearCart(): Observable<any[]> {
    const userId = this.getUserId();
    return this.http.delete<any[]>(`${this.apiUrl}/cart/${userId}`)
      .pipe(
        tap(items => {
          this.cartItems = items;
          this.cartItemsSubject.next(this.cartItems);
          this.updateCount();
        })
      );
  }

  // Update total count
  private updateCount(): void {
    const totalItems = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
    this.cartCount.next(totalItems);
  }

  // Refresh cart from backend (e.g., after login)
  refreshCart(): void {
    this.loadCart();
  }
}
