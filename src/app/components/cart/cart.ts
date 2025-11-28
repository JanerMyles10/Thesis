import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  subtotal = 0;
  totalItems = 0;
  loading = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateTotal();
    });

    this.cartService.refreshCart();
  }

  updateTotal(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  increaseQuantity(item: any): void {
    this.loading = true;
    const newQuantity = item.quantity + 1;

    this.cartService.updateQuantity(item._id, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.updateTotal();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating quantity:', err);
        this.loading = false;
      }
    });
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.loading = true;
      const newQuantity = item.quantity - 1;

      this.cartService.updateQuantity(item._id, newQuantity).subscribe({
        next: () => {
          item.quantity = newQuantity;
          this.updateTotal();
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating quantity:', err);
          this.loading = false;
        }
      });
    }
  }

  removeFromCart(item: any): void {
    this.loading = true;
    this.cartService.removeFromCart(item).subscribe({
      next: () => {

        this.updateTotal();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error removing item:', err);
        this.loading = false;
      }
    });
  }

  backCart(): void {
    this.router.navigate(['/homeprod']);
  }
}
