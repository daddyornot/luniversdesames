import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CartService} from "./services/cart/cart";
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {AuthService} from './core/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatIconButton, MatIcon, RouterLinkActive, MatMenu, MatMenuTrigger, MatMenuItem],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private cartService = inject(CartService);
  protected auth = inject(AuthService);
  private router = inject(Router);

  // On expose le signal pour le template
  cartCount = this.cartService.count;

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
