import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();

  addToCart(product: any) {
    this.items.push(product);
    this.cartCount.next(this.items.length); // updates live count
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    this.cartCount.next(0);
  }
}
