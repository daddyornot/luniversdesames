import {Component, inject, OnInit, Signal, signal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {AuthService} from '../../../core/auth/auth';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ToastService} from '../../../services/toast/toast';
import {AuthControllerService, OrderDTO, UserDTO} from '../../../core/api';
import {OrderStore} from '../../../store/order.store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePipe, RouterLink, FormsModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly orderStore = inject(OrderStore);
  private readonly authApi = inject(AuthControllerService);
  private readonly toast = inject(ToastService);

  orders: Signal<OrderDTO[]> = this.orderStore.orders;
  isLoadingOrders = this.orderStore.loading;

  userProfile = signal<UserDTO | null>(null);
  isEditingProfile = signal(false);

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    this.authApi.getCurrentUserProfile().subscribe({
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

    this.authApi.updateCurrentUserProfile(user).subscribe({
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

  protected handleDownload(orderId: number, invoiceNumber: string) {
    this.orderStore.downloadInvoice({orderId, invoiceNumber});
  }
}
