import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/sellerpage'; // Ensure this path is correct
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  // Variables for Adding Products
  newProduct: any = { name: '', price: null, size: '', description: '', image: null };

  // Variables for Listing
  sellerProducts: any[] = [];
  currentOwnerId: string | null = null;

  // 🔥 NEW: Variables for Editing
  productToEdit: any = {};
  editImageFile: File | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // 1. Get the logged-in User ID
    this.currentOwnerId = localStorage.getItem('userId');

    // 2. Load the products immediately
    this.loadSellerProducts();
  }

  // --- FETCH PRODUCTS ---
    loadSellerProducts() {
      this.productService.getProducts().subscribe({
        next: (products) => {
          if (this.currentOwnerId) {
            this.sellerProducts = products.filter(p => p.ownerId === this.currentOwnerId);


          localStorage.setItem(`seller_${this.currentOwnerId}_productCount`, this.sellerProducts.length.toString());
          }
        },
        error: (err) => console.error('Error loading products:', err)
      });
    }


  // --- ADD PRODUCT LOGIC ---
  onFileSelected(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      this.newProduct.image = files[0];
    }
  }

  saveProduct() {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.image) {
      alert('Please fill in Name, Price and Image.');
      return;
    }

    if (!this.currentOwnerId) {
      alert("Error: User ID missing. Please relogin.");
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price.toString());
    formData.append('description', this.newProduct.description || '');
    formData.append('ownerId', this.currentOwnerId);
    formData.append('image', this.newProduct.image);

    this.productService.addProduct(formData).subscribe({
      next: (res) => {
        alert('✅ Product Added Successfully!');

        // Reset Form
        this.newProduct = { name: '', price: null, size: '', description: '', image: null };

        // Close Add Modal
        const modalEl = document.getElementById('addProductModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        }

        this.loadSellerProducts(); // Refresh list
      },
      error: (err) => {
        console.error(err);
        alert('Failed to save product.');
      }
    });
  }

  // ==========================================
  // 🔥 NEW: EDIT PRODUCT LOGIC
  // ==========================================

  // 1. Open the Edit Modal with current data
  openEditModal(product: any) {
    this.productToEdit = { ...product }; // Copy data so we don't mutate view directly
    this.editImageFile = null; // Reset image input

    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
  }

  // 2. Handle Image Change in Edit Modal
  onEditFileSelected(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      this.editImageFile = files[0];
    }
  }

  // 3. Save Changes
  saveEditedProduct() {
    const formData = new FormData();
    formData.append('name', this.productToEdit.name);
    formData.append('price', this.productToEdit.price);
    formData.append('description', this.productToEdit.description);

    // Only append image if user picked a new one
    if (this.editImageFile) {
      formData.append('image', this.editImageFile);
    }

    // Call Service
    this.productService.updateProduct(this.productToEdit._id, formData).subscribe({
      next: (res) => {
        alert('✅ Product Updated Successfully!');

        // Close Edit Modal
        const modalEl = document.getElementById('editProductModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        }

        this.loadSellerProducts(); // Refresh Grid
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update product.');
      }
    });
  }

  // ==========================================
  // 🔥 NEW: DELETE PRODUCT LOGIC
  // ==========================================
  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: (res) => {
          this.loadSellerProducts(); // Refresh Grid
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete product.');
        }
      });
    }
  }
}
