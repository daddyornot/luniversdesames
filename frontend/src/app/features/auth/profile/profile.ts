import {Component, inject, signal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {AuthService} from '../../../core/auth/auth';
import {Order, OrderService} from '../../../services/order/order';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePipe, RouterLink],
  templateUrl: './profile.html'
})
export class ProfileComponent {
  auth = inject(AuthService);
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);

  constructor() {
    this.loadOrders();
  }

  private loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement commandes', err);
        this.isLoading.set(false);
        // On pourrait afficher un toast ici
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'En attente',
      'PAID': 'Payée',
      'SHIPPED': 'Expédiée',
      'DELIVERED': 'Livrée',
      'CANCELLED': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
