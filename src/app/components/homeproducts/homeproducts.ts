import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/sellerpage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homeproducts',
  imports: [CommonModule],
  templateUrl: './homeproducts.html',
  styleUrl: './homeproducts.css'
})
export class Homeproducts  implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}
