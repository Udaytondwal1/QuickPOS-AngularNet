import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PosServiceService {
  private apiUrl = 'https://localhost:44309/api/POS';

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  // Add a new category
  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-category`, category);
  }

  // Update an existing category
  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-category/${id}`, category);
  }

  // Delete a category
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-category/${id}`);
  }

  // Get all products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  // Add a new product
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-product`, product);
  }

  // Update an existing product
  updateProduct(productId: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-product/${productId}`, product);
  }

  // Delete a product
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-product/${productId}`);
  }

  // Create an order
  createOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-order`, order);
  }

  // Get a single order by ID
  getOrder(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-order/${id}`);
  }

  // Get all orders
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all-orders`);
  }

  // Update order quantity
  updateOrderQuantity(id: number, updatedItems: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-order-quantity/${id}`, updatedItems);
  }

  // Delete an order
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-order/${id}`);
  }

   // Delete an order
   CancelOrder(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cancel-order/${id}`, null);
  }
}
