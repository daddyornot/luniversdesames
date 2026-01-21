import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductVariant {
  id?: number;
  label: string;
  price: number;
  sessionCount?: number;
  durationMonths?: number;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stone?: string;
  imageUrl?: string;
  type: 'PHYSICAL' | 'SERVICE' | 'SUBSCRIPTION';
  sessionCount?: number;
  durationMonths?: number;
  variants?: ProductVariant[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
