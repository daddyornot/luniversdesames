import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  appointmentDate?: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  status?: string;
  billingAddress?: string;
  billingCity?: string;
  billingPostalCode?: string;
  billingCountry?: string;

  // Shipping
  trackingNumber?: string;
  trackingUrl?: string;
  shippingStatus?: string;
  shippingLabelUrl?: string;
}

@Injectable({providedIn: 'root'})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/invoice`, { responseType: 'blob' });
  }

  createShippingLabel(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/ship`, {});
  }
}
