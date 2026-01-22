import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order } from '../../../services/orders';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  orders: Order[] = [];
  loading = true;
  error = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.ordersService.getSellerOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  changeStatus(order: Order, newStatus: 'Complete' | 'Cancelled') {
    this.ordersService.updateOrderStatus(order._id, newStatus).subscribe({
      next: () => {
        order.status = newStatus; // Update frontend UI
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update order status');
      }
    });
  }
}

