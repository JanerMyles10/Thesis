import { Component, OnInit } from '@angular/core';
import { ProductService, } from '../../services/sellerpage';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-homeproducts',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './homeproducts.html',
  styleUrl: './homeproducts.css'
})
export class Homeproducts implements OnInit {
  products: any[] = [];
  cartCount = 0;
  searchTerm: string = '';
  userId: string | null = null;
  name: string |  null = null;
  selectedProduct: any = null;
  selectedQuantity: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  // ✅ Filtered products based on search term
  get filteredProducts() {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.name = localStorage.getItem('name');

    // ✅ Load products from backend
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    // ✅ Subscribe to cart count updates
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }


  addToCart(product: any) {
    this.selectedProduct = { ...product }; // Create a copy
    this.selectedQuantity = 1; // reset quantity each time

    const modal = new bootstrap.Modal(
      document.getElementById('addToCartModal')
    );
    modal.show();
  }

  // ✅ Confirm adding to cart after quantity input
  confirmAddToCart() {
    if (this.selectedProduct && this.selectedQuantity > 0) {
      const productToAdd = {
        ...this.selectedProduct,
        quantity: this.selectedQuantity
      };

      // ✅ Subscribe to the Observable to actually add to cart
      this.cartService.addToCart(productToAdd).subscribe({
        next: (items: any[]) => {
          console.log('Product added to cart!', items);

          // Hide modal
          const modalEl = document.getElementById('addToCartModal');
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();

        },
        error: (err: any) => {
          console.error('Error adding to cart:', err);
          alert('Failed to add product to cart. Please try again.');
        }
      });
    }
  }

  // ✅ For "View Product" modal
  viewProduct(product: any) {
    this.selectedProduct = product;
    const modal = new bootstrap.Modal(
      document.getElementById('viewProductModal')
    );
    modal.show();
  }

  updateCart() {
    this.router.navigate(['/cart']);
  }

  // ✅ Logout
  logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/']);
  }

  openSettings() {
    const modal = new bootstrap.Modal(document.getElementById('settingsModal')!);
    modal.show();
  }
}
