// frontend/src/app/shared/components/top-banner/top-banner.ts
import {Component, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-top-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './top-banner.html'
})
export class TopBannerComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // Configuration de la bannière (pourrait venir d'un fichier environment ou d'une API plus tard)
  config = signal({
    enabled: true,
    message: '✨ Livraison offerte dès 50€ d\'achat !',
    link: '/products', // Lien optionnel
    linkText: 'En profiter', // Texte du lien
    dismissible: true // Peut-on la fermer ?
  });

  isVisible = signal(false);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Vérifie si la bannière a déjà été fermée dans cette session
      const isDismissed = sessionStorage.getItem('top-banner-dismissed');
      if (this.config().enabled && !isDismissed) {
        this.isVisible.set(true);
      }
    }
  }

  close() {
    this.isVisible.set(false);
    if (this.config().dismissible && isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('top-banner-dismissed', 'true');
    }
  }
}
