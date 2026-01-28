import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/sellerpage';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  orders: any[] = [];
  totalOrders = 0;
  totalAmount = 0;
  completedOrders = 0;

  currentUserId = localStorage.getItem('userId');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (!this.currentUserId) return;

    this.productService.getSellerOrders(this.currentUserId)
      .subscribe(res => {
        this.orders = res;

        // Calculate stats
        this.totalOrders = res.length;
        this.totalAmount = res.reduce((acc, order) => acc + order.total, 0);
        this.completedOrders = res.filter(o => o.status === 'Completed').length;
      });
  }
}
