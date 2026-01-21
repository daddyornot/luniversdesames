import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '../../core/services/api.service';

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  appointmentDate?: string;
}

export interface Order {
  id: number;
  date: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  items: {
    productId: string | number;
    quantity: number;
    appointmentDate?: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private api = inject(ApiService);

  getMyOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('orders/my-orders');
  }

  createOrder(order: CreateOrderRequest): Observable<any> {
    return this.api.post('orders', order);
  }
}
