import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    // On vérifie une seule fois au démarrage si on est côté client
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Stocker une donnée (convertit automatiquement les objets en JSON)
  setItem(key: string, value: any): void {
    if (this.isBrowser) {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  }

  // Récupérer une donnée
  getItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  // Supprimer une clé précise
  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  // Tout effacer
  clear(): void {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }
}
