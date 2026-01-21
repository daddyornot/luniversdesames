import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../../services/cart/cart';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: 'bottom-nav.html'

})
export class BottomNavComponent {
  private cartService = inject(CartService);
  auth = inject(AuthService);
  cartCount = this.cartService.count;
}
