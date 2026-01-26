import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocalStorageService} from '../../local-storage/local-storage';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (!accepted()) {
      <div
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60] animate-in slide-in-from-bottom-4 duration-500">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-600 flex-1">
            <p>
              Nous utilisons des cookies essentiels pour le bon fonctionnement du site (panier, connexion).
              Pour en savoir plus, consultez notre <a routerLink="/mentions-legales"
                                                      class="text-spirit-primary underline hover:text-spirit-accent">Politique
              de Confidentialité</a>.
            </p>
          </div>
          <div class="flex gap-3">
            <button (click)="accept()"
                    class="px-6 py-2 bg-spirit-primary text-white rounded-full text-sm font-bold shadow-md hover:bg-spirit-primary/90 transition-colors">
              J'ai compris
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class CookieBannerComponent {
  private localStorage = inject(LocalStorageService);
  accepted = signal(false);

  constructor() {
    // Vérifie si l'utilisateur a déjà accepté
    const hasAccepted = this.localStorage.getItem('cookies_accepted');
    if (hasAccepted === 'true') {
      this.accepted.set(true);
    }
  }

  accept() {
    this.localStorage.setItem('cookies_accepted', 'true');
    this.accepted.set(true);
  }
}
