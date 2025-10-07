import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id?: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: any): Observable<Product> {
  const formData = new FormData();
  formData.append("name", product.name);
  // ensure values are strings where appropriate
  formData.append("price", String(product.price));
  formData.append("description", product.description || '');
  if (product.image) {
    // include the filename when appending a File/Blob so backend can use it
    formData.append("image", product.image, (product.image && product.image.name) || 'image'); // must match multer field name
  }

  return this.http.post<Product>(this.apiUrl, formData);
}
}
