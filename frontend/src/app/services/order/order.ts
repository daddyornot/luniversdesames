import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderControllerService, OrderRequest } from '../../core/api';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly api = inject(OrderControllerService);

    getMyOrders(): Observable<Order[]> {
        return this.api.getMyOrders();
    }

    createOrder(order: OrderRequest): Observable<any> {
        return this.api.createOrder(order);
    }

    downloadInvoice(orderId: number): Observable<Blob> {
        return this.api.downloadOrderInvoice(orderId);
    }
}
