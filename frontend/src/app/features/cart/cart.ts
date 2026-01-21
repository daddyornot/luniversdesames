import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../services/cart/cart';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/auth';
import {ToastService} from '../../services/toast/toast';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, NgOptimizedImage],
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cart {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  cartService = inject(CartService);

  items = this.cartService.items;
  total = this.cartService.totalPrice;
  count = this.cartService.count;
  isProcessing = signal(false);

  updateQty(id: string | number, delta: number) {
    this.cartService.updateQuantity(id, delta);
  }

  remove(id: string | number) {
    this.cartService.removeItem(id);
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
