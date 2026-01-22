import { CommonModule ,} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,FormsModule,],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  subtotal = 0;
  totalItems = 0;

  constructor(private cartService: CartService
    , private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.updateTotal();
  }

  updateTotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.updateTotal();
  }

  decreaseQuantity(item: any) { 
    if (item.quantity > 1) item.quantity--;
    this.updateTotal();
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
    this.cartItems = this.cartService.getCartItems();
    this.updateTotal();
  }

  backCart(){
    this.router.navigate(['/homeprod']);
  }
}
