import {Component, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../services/cart';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, NgOptimizedImage],
  templateUrl: './cart.html'
})
export class Cart {
  cartService = inject(CartService);

  // Accès aux signaux du service
  items = this.cartService.items;
  total = this.cartService.totalPrice;
  count = this.cartService.count;

  updateQty(id: string | number, delta: number) {
    this.cartService.updateQuantity(id, delta);
  }

  remove(id: string | number) {
    this.cartService.removeItem(id);
  }
}
