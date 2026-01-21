import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {CartService} from '../../../services/cart/cart';
import {ToastService} from '../../../services/toast/toast';
import {API_CONFIG} from '../../../core/config/api.config';
import {AuthService} from '../../../core/auth/auth';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html'
})
export class PaymentComponent implements OnInit {
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  ngOnInit() {
    this.initiateCheckout();
  }

  initiateCheckout() {
    const user = this.auth.currentUser();
    const orderPayload = {
      customerName: user?.firstName || 'Client',
      customerEmail: user?.email,
      items: this.cartService.items().map(item => ({
        productId: item.id,
        quantity: item.quantity,
        appointmentDate: item.appointmentDate
      }))
    };

    this.http.post<{url: string}>(`${API_CONFIG.baseUrl}/payment/create-session`, orderPayload)
      .subscribe({
        next: (res) => {
          // Redirection vers Stripe Checkout
          window.location.href = res.url;
        },
        error: (err) => {
          console.error(err);
          this.toast.showError('Erreur lors de l\'initialisation du paiement');
        }
      });
  }
}
