import {Component, computed, inject, input, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../../services/cart/cart';
import {CartItem} from '../../../core/models/cart';
import {CommonModule} from '@angular/common';
import {Product, ProductVariant} from '../../../core/models/product';

@Component({
  selector: 'app-shop-item',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  templateUrl: 'shop-item.html'
})
export class ShopItem implements OnInit {
  product = input.required<Product>();
  private cartService = inject(CartService);

  // État local pour la variante sélectionnée
  selectedVariant = signal<ProductVariant | null>(null);

  // Prix affiché dynamique
  displayPrice = computed(() => {
    const v = this.selectedVariant();
    return v ? v.price : this.product().price;
  });

  ngOnInit() {
    // Si le produit a des variantes, on sélectionne la première par défaut pour l'affichage
    const p = this.product();
    if (p.variants && p.variants.length > 0) {
      this.selectedVariant.set(p.variants[0]);
    }
  }

  selectVariant(event: Event, variant: ProductVariant) {
    event.stopPropagation(); // Empêche d'ouvrir le détail du produit
    this.selectedVariant.set(variant);
  }

  protected addToCart(event: Event) {
    event.stopPropagation();
    const p = this.product();

    // Si c'est un service qui nécessite une date (Coaching, Soin...), on redirige vers le détail
    // SAUF si c'est un produit physique
    if (p.type !== 'PHYSICAL') {
      return;
    }

    const variant = this.selectedVariant();
    const finalPrice = variant ? variant.price : p.price;
    const finalName = variant ? `${p.name} - ${variant.label}` : p.name;

    const item: CartItem = {
      id: p.id,
      name: finalName,
      price: finalPrice,
      imageUrl: p.imageUrl,
      quantity: 1,
      type: p.type
    };

    this.cartService.addToCart(item);
  }
}
