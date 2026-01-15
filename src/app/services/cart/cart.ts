import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {CartItem} from '../../core/models/cart';
import {LocalStorageService} from '../../core/local-storage/local-storage';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly localStorageService = inject(LocalStorageService);

  // 1. L'état du panier (Privé pour ne pas le modifier directement de l'extérieur)
  private cartItems = signal<CartItem[]>([]);

  // 2. Sélecteurs calculés (Mis à jour automatiquement)
  items = this.cartItems.asReadonly();

  count = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  constructor() {
    // 3. Persistance : Sauvegarde automatique en LocalStorage dès que le signal change
    effect(() => {
      this.localStorageService.setItem('spirit_cart', JSON.stringify(this.cartItems()));
    });
  }

  // --- ACTIONS ---

  addToCart(product: CartItem) {
    this.cartItems.update(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);

      if (existingItem) {
        // Si l'article existe, on crée un nouveau tableau avec la quantité mise à jour
        return currentItems.map(item =>
          item.id === product.id
            ? {...item, quantity: item.quantity + product.quantity}
            : item
        );
      }
      // Sinon on ajoute le nouvel article
      return [...currentItems, product];
    });
  }

  removeItem(id: string | number) {
    this.cartItems.update(items => items.filter(i => i.id !== id));
  }

  updateQuantity(id: string | number, delta: number) {
    this.cartItems.update(items => items.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return {...item, quantity: newQty > 0 ? newQty : 1};
      }
      return item;
    }));
  }

  clearCart() {
    this.cartItems.set([]);
  }

  private loadFromStorage(): CartItem[] {
    const saved = this.localStorageService.getItem('spirit_cart');
    return saved ? JSON.parse(saved) : [];
  }
}
