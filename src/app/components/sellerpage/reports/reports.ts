import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order } from '../../../services/orders';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  imports: [CommonModule,FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  currentUserId: string | null = null;

  totalSales: number = 0;
  totalOrders: number = 0;
  topProduct: string = '';
  recentSales: Order[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    // Get current seller ID
    this.currentUserId = localStorage.getItem('userId');
    if (!this.currentUserId) return;

    // Fetch seller's orders
    this.ordersService.getSellerOrders().subscribe((orders: Order[]) => {
      // Filter only current seller's orders
      const myOrders = orders.filter(o => o.sellerId === this.currentUserId);

      // Total Orders
      this.totalOrders = myOrders.length;

      // Total Sales (sum of completed orders)
      this.totalSales = myOrders
        .filter(o => o.status === 'Complete')
        .reduce((sum, order) => sum + order.total, 0);

      // Top Product (most sold quantity)
      const productCount: { [name: string]: number } = {};
      myOrders.forEach(order => {
        if (order.status === 'Complete') {
          productCount[order.productName] = (productCount[order.productName] || 0) + order.quantity;
        }
      });

      this.topProduct = Object.keys(productCount).reduce((a, b) =>
        productCount[a] > productCount[b] ? a : b,
        ''
      );

      // Recent Sales (latest 10 orders)
      this.recentSales = myOrders
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    });
  }
}
