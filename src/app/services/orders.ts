import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  _id: string;
  sellerId: string;
  buyerName: string;
  productName: string;
  quantity: number;
  total: number;
  status: 'Pending' | 'Complete' | 'Cancelled';
  date:string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:5000/api/products';

    constructor(private http: HttpClient) {}

  // Get all orders for the seller
  getSellerOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/seller`);
  }

  // ✅ NEW: Get total orders count for seller
  getTotalOrders(sellerId: string): Observable<{ totalOrders: number }> {
    return this.http.get<{ totalOrders: number }>(
      `${this.apiUrl}/seller/${sellerId}/count`
    );
  }

  // Update order status
  updateOrderStatus(
    orderId: string,
    status: 'Complete' | 'Cancelled'
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, { status });
  }
}
