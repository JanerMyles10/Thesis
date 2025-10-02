import { Component } from '@angular/core';
import { ProductService } from '../../../services/sellerpage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule,FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
   newProduct: any = { name: '', price: 0, description: '', image: null };

  constructor(private productService: ProductService) {}

  // when file is chosen
  onFileSelected(event: any) {
    this.newProduct.image = event.target.files[0];
  }

  // save product to backend
 saveProduct() {
  if (!this.newProduct.name || !this.newProduct.price) {
    alert('Please fill in product name and price');
    return;
  }

  this.productService.addProduct(this.newProduct).subscribe({
    next: (res) => {
      alert('✅ Product saved with image!');
      console.log(res);
      this.newProduct = { name: '', price: 0, description: '', image: null };
      const modal = document.getElementById('addProductModal');
      if (modal) {
        (window as any).bootstrap.Modal.getInstance(modal)?.hide();
      }
    },
    error: (err) => {
      console.error(err);
      alert('Please complete the details below');
    }
  });
}
}
