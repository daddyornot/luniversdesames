import {computed, inject, Injectable, signal} from '@angular/core';
import {ToastService} from '../toast/toast';
import {CartItem} from '../../core/models/cart';
import {LocalStorageService} from '../../core/local-storage/local-storage';
import {Product, ProductSize, ProductVariant} from '../../core/models/product';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly localStorageService = inject(LocalStorageService)
  private toast = inject(ToastService);
  items = signal<CartItem[]>([]);

  totalPrice = computed(() => this.items().reduce((total, item) => total + (item.price * item.quantity), 0));
  count = computed(() => this.items().reduce((count, item) => count + item.quantity, 0));

  constructor() {
    this.loadCart();
  }

  addToCart(product: CartItem) {
    const currentItems = this.items();
    const existingItem = currentItems.find(item =>
      item.id === product.id &&
      item.selectedVariant?.id === product.selectedVariant?.id &&
      item.selectedSize?.id === product.selectedSize?.id
    );

    if (existingItem) {
      this.items.update(items => items.map(i =>
        i === existingItem ? {...i, quantity: i.quantity + product.quantity} : i
      ));
    } else {
      this.items.update(items => [...items, product]);
    }
    this.saveCart();
    this.toast.showSuccess(`${product.name} ajouté au panier !`);
  }

  updateQuantity(id: number, delta: number) {
    this.items.update(items => {
      return items.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? {...item, quantity: newQty} : item;
        }
        return item;
      });
    });
    this.saveCart();
  }

  removeItem(id: number) {
    this.items.update(items => items.filter(item => item.id !== id));
    this.saveCart();
  }

  clearCart() {
    this.items.set([]);
    this.saveCart();
  }

  private saveCart() {
    this.localStorageService.setItem('cart', JSON.stringify(this.items()));
  }

  private loadCart() {
    const saved = this.localStorageService.getItem('cart');
    if (saved) {
      this.items.set(JSON.parse(saved));
    }
  }
}
