import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth';
import { ToastService } from '../../services/toast/toast';
import { CartStore } from '../../store/cart.store';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, MatIconModule, RouterLink],
    templateUrl: './cart.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cart {
    private readonly router = inject(Router);
    private readonly auth = inject(AuthService);
    private readonly toast = inject(ToastService);
    protected readonly cartStore = inject(CartStore);

    protected items = this.cartStore.items;
    protected total = this.cartStore.totalPrice;
    protected cartCount = this.cartStore.count;

    updateQty(id: number, delta: number) {
        this.cartStore.updateQuantity(id, delta);
    }

    remove(id: number) {
        this.cartStore.removeItem(id);
    }

    checkout() {
        if (!this.auth.isAuthenticated()) {
            this.toast.showError('Veuillez vous connecter pour commander');
            this.router.navigate(['/auth']);
            return;
        }

        // Redirection vers la page de paiement sécurisé
        this.router.navigate(['/checkout']);
    }
}
