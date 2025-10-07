import { Component, OnInit } from '@angular/core';
import { ProductService, } from '../../services/sellerpage';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-homeproducts',
  imports: [CommonModule],
  templateUrl: './homeproducts.html',
  styleUrl: './homeproducts.css'
})
export class Homeproducts  implements OnInit {
   products: any[] = [];
   cartCount = 0;
   searchTerm: string = '';

   userEmail: string | null = null;


  get filteredProducts() {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
  // Get logged-in user's email
  this.userEmail = localStorage.getItem('userEmail');

  // Load products from backend
  this.productService.getProducts().subscribe((data) => {
    this.products = data;
  });

  // Subscribe to cart count updates
  this.cartService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });
}


  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  updateCart() {
    console.log("Cart clicked! You can show a modal or navigate.");
  }
}
