import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../../services/cart/cart';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around py-2 pb-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">

      <a routerLink="/"
         routerLinkActive="text-spirit-primary scale-110"
         [routerLinkActiveOptions]="{exact: true}"
         class="group flex flex-col items-center transition-all duration-300 text-gray-400 hover:text-spirit-primary/70">
        <mat-icon class="text-[28px] mb-0.5 transition-transform group-active:scale-90">home</mat-icon>
        <span class="text-[10px] font-medium uppercase tracking-tighter opacity-80">Accueil</span>
      </a>

      <a routerLink="/boutique"
         routerLinkActive="text-spirit-primary scale-110"
         class="group flex flex-col items-center transition-all duration-300 text-gray-400 hover:text-spirit-primary/70">
        <mat-icon class="text-[28px] mb-0.5 transition-transform group-active:scale-90">auto_awesome</mat-icon>
        <span class="text-[10px] font-medium uppercase tracking-tighter opacity-80">Bracelets</span>
      </a>

      <!-- Lien Admin (visible uniquement si connecté, à affiner avec les rôles plus tard) -->
      @if (auth.isAuthenticated()) {
        <a routerLink="/admin"
           routerLinkActive="text-spirit-primary scale-110"
           class="group flex flex-col items-center transition-all duration-300 text-gray-400 hover:text-spirit-primary/70">
          <mat-icon class="text-[28px] mb-0.5 transition-transform group-active:scale-90">admin_panel_settings</mat-icon>
          <span class="text-[10px] font-medium uppercase tracking-tighter opacity-80">Admin</span>
        </a>
      }

      <a routerLink="/panier"
         routerLinkActive="text-spirit-primary scale-110"
         class="group relative flex flex-col items-center transition-all duration-300 text-gray-400 hover:text-spirit-primary/70">
        <mat-icon class="text-[28px] mb-0.5 transition-transform group-active:scale-90">shopping_bag</mat-icon>
        <span class="text-[10px] font-medium uppercase tracking-tighter opacity-80">Panier</span>

        @if (cartCount() > 0) {
          <span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-spirit-accent text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in shadow-sm">
            {{ cartCount() }}
          </span>
        }
      </a>

    </nav>
  `
})
export class BottomNavComponent {
  private cartService = inject(CartService);
  auth = inject(AuthService);
  cartCount = this.cartService.count;
}
