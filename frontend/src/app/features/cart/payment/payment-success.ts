import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {CartService} from '../../../services/cart/cart';
import {CreateOrderRequest, OrderService} from '../../../services/order/order';
import {AuthService} from '../../../core/auth/auth';
import {ToastService} from '../../../services/toast/toast';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.html'
})
export class PaymentSuccessComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  ngOnInit() {
    // On finalise la commande ici (version simplifiée sans Webhook)
    // Idéalement, on devrait vérifier le session_id auprès du backend
    this.finalizeOrder();
  }

  finalizeOrder() {
    const items = this.cartService.items();
    if (items.length === 0) return; // Déjà traité

    const user = this.auth.currentUser();
    const orderPayload: CreateOrderRequest = {
      customerName: user?.firstName || 'Client',
      customerEmail: user?.email || 'email',
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        appointmentDate: item.appointmentDate
      }))
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.toast.showSuccess('Commande enregistrée');
      },
      error: (err) => {
        console.error('Erreur création commande', err);
        // Même si ça échoue ici (ex: doublon), le paiement est passé.
        // On vide le panier pour ne pas confondre l'utilisateur.
        this.cartService.clearCart();
      }
    });
  }
}
