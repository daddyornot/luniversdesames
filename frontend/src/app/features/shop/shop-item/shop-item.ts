import {Component, computed, inject, input, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../../services/cart/cart';
import {CartItem} from '../../../core/models/cart';
import {Product, ProductVariant} from '../../../core/models/product';
import {CommonModule} from '@angular/common';

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
      // On ne peut pas ajouter au panier directement depuis la liste car il faut choisir une date
      // On pourrait rediriger vers le détail ici, ou afficher un toast "Veuillez choisir une date"
      // Pour l'instant, le bouton "+" servira de lien vers le détail pour ces produits
      return;
    }

    const variant = this.selectedVariant();
    const finalPrice = variant ? variant.price : p.price;
    const finalName = variant ? `${p.name} - ${variant.label}` : p.name;

    const item: CartItem = {
      id: p.id,
      name: finalName,
      price: finalPrice,
      image: p.imageUrl,
      quantity: 1,
      type: 'bracelet' // Par défaut ici car on a filtré les services au dessus
    };

    this.cartService.addToCart(item);
  }
}
