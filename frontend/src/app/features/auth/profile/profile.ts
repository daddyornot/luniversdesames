import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {AuthService} from '../../../core/auth/auth';
import {Order, OrderService} from '../../../services/order/order';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../../core/services/api.service';
import {User} from '../../../core/models/user';
import {FormsModule} from '@angular/forms';
import {ToastService} from '../../../services/toast/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePipe, RouterLink, FormsModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private orderService = inject(OrderService);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  orders = signal<Order[]>([]);
  isLoadingOrders = signal(true);

  userProfile = signal<User | null>(null);
  isEditingProfile = signal(false);

  ngOnInit() {
    this.loadOrders();
    this.loadProfile();
  }

  private loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoadingOrders.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement commandes', err);
        this.isLoadingOrders.set(false);
      }
    });
  }

  private loadProfile() {
    this.api.get<User>('auth/profile').subscribe({
      next: (user) => this.userProfile.set(user),
      error: (err) => console.error('Erreur chargement profil', err)
    });
  }

  toggleEdit() {
    this.isEditingProfile.update(v => !v);
  }

  saveProfile() {
    const user = this.userProfile();
    if (!user) return;

    this.api.put<User>('auth/profile', user).subscribe({
      next: (updatedUser) => {
        this.userProfile.set(updatedUser);
        this.isEditingProfile.set(false);
        this.toast.showSuccess('Profil mis à jour');
      },
      error: () => this.toast.showError('Erreur lors de la mise à jour')
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
