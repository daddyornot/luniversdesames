import {Component, inject, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../services/cart/cart';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/auth';
import {ToastService} from '../../services/toast/toast';
import {OrderService} from '../../services/order/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, NgOptimizedImage],
  templateUrl: './cart.html'
})
export class Cart {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private orderService = inject(OrderService);
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

    this.isProcessing.set(true);
    const user = this.auth.currentUser();

    const orderPayload = {
      customerName: user?.firstName || 'Client',
      customerEmail: user?.email || '',
      items: this.items().map(item => ({
        productId: item.id,
        quantity: item.quantity,
        appointmentDate: item.appointmentDate
      }))
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.toast.showSuccess('Commande validée avec succès !');
        this.isProcessing.set(false);
        this.router.navigate(['/mon-compte/commandes']);
      },
      error: (err) => {
        console.error(err);
        this.toast.showError('Une erreur est survenue lors de la commande.');
        this.isProcessing.set(false);
      }
    });
  }
}
