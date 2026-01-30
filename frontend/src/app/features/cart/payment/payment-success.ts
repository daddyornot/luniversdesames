import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../core/auth/auth';
import {ToastService} from '../../../services/toast/toast';
import {OrderRequest} from '../../../core/api';
import {CartStore} from '../../../store/cart.store';
import {OrderStore} from '../../../store/order.store';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.html'
})
export class PaymentSuccessComponent implements OnInit {
  private readonly cartStore = inject(CartStore);
  private readonly orderStore = inject(OrderStore);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  ngOnInit() {
    // On finalise la commande ici (version simplifiée sans Webhook)
    // Idéalement, on devrait vérifier le session_id auprès du backend
    this.finalizeOrder();
  }

  finalizeOrder() {
    const items = this.cartStore.items();
    if (items.length === 0) return; // Déjà traité

    const user = this.auth.currentUser();
    const orderPayload: OrderRequest = {
      customerName: user?.firstName || 'Client',
      customerEmail: user?.email || 'email',
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        appointmentDate: item.appointmentDate
      }))
    };

    this.orderStore.createOrder({
      request: orderPayload,
      onSuccess: () => {
        this.cartStore.clearCart();
        this.toast.showSuccess('Commande enregistrée');
      },
      onError: (err) => {
        console.error('Erreur création commande', err);
        // Même si ça échoue ici (ex: doublon), le paiement est passé.
        // On vide le panier pour ne pas confondre l'utilisateur.
        this.cartStore.clearCart();
      }
    });
  }
}
