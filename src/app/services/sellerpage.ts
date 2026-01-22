import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // ✅ FIXED: Added '/api' to match your app.js configuration
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(): Observable<any[]> {
    // This calls http://localhost:5000/api/products
    return this.http.get<any[]>(this.apiUrl);
  }

  // Submit a review
  addReview(reviewData: any): Observable<any> {
    // This calls http://localhost:5000/api/products/review
    return this.http.post(`${this.apiUrl}/review`, reviewData);
  }

  // ==========================================
  // 2. SELLER METHODS
  // ==========================================

  // Add a new product
  addProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData);
  }

  // Get products for a specific seller
  getSellerProducts(ownerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?ownerId=${ownerId}`);
  }

  // Check if user has a shop
  getShopStatus(email: string): Observable<any> {
    // ✅ FIXED: Added '/api' here too
    // This calls http://localhost:5000/api/shop-applications/status/email@example.com
    return this.http.get<any>(`http://localhost:5000/api/shop-applications/status/${email}`);
  }

  updateProduct(id: string, productData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, productData);
}

deleteProduct(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}


sendMessage(messageData: any): Observable<any> {
  // Matches the route we created in Step 2
  return this.http.post('http://localhost:5000/api/messages/send', messageData);
}
getMyConversations(userId: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:5000/api/messages/my-conversations/${userId}`);
}

getChatHistory(userId: string, otherId: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:5000/api/messages/chat/${userId}/${otherId}`);
}
// Get number of unread messages
getUnreadCount(userId: string): Observable<any> {
  return this.http.get<any>(`http://localhost:5000/api/messages/unread-count/${userId}`);
}

// Mark messages as read
markMessagesAsRead(myId: string, otherId: string): Observable<any> {
  return this.http.put(`http://localhost:5000/api/messages/mark-read/${myId}/${otherId}`, {});
}

getTotalOrders(sellerId: string) {
  return this.http.get<{ totalOrders: number }>(
    `${this.apiUrl}/count/${sellerId}`
  );
}
}
