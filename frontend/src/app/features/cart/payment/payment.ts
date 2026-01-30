import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast/toast';
import { AuthService } from '../../../core/auth/auth';
import { CartStore } from '../../../store/cart.store';
import { PaymentControllerService } from '../../../core/api';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './payment.html'
})
export class PaymentComponent implements OnInit {
    private readonly paymentApi = inject(PaymentControllerService);
    private readonly cartStore = inject(CartStore);
    private readonly toast = inject(ToastService);
    private readonly auth = inject(AuthService);

    ngOnInit() {
        this.initiateCheckout();
    }

    initiateCheckout() {
        const user = this.auth.currentUser();
        if (!user) {
            this.toast.showError('Impossible d\'effectuer un paiement : l\'utilisateur n\'est pas connecté !');
            return;
        }
        const orderPayload = {
            customerName: user.firstName,
            customerEmail: user.email,
            items: this.cartStore.items().map(item => ({
                productId: item.id,
                quantity: item.quantity,
                appointmentDate: item.appointmentDate
            }))
        };

        this.paymentApi.createCheckoutSession(orderPayload)
            .subscribe({
                next: (res) => {
                    // Redirection vers Stripe Checkout
                    if (res.url != null) {
                        globalThis.location.href = res.url;
                    }
                },
                error: (err) => {
                    console.error(err);
                    this.toast.showError('Erreur lors de l\'initialisation du paiement');
                }
            });
    }
}
