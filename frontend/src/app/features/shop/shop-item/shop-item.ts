import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../../../core/models/cart';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductDTO, ProductVariantDTO } from '../../../core/api';
import { CartStore } from '../../../store/cart.store';

@Component({
    selector: 'app-shop-item',
    standalone: true,
    imports: [MatIconModule, CommonModule, RouterModule],
    templateUrl: 'shop-item.html'
})
export class ShopItem implements OnInit {
    product = input.required<ProductDTO>();

    private readonly cartStore = inject(CartStore);

    // État local pour la variante sélectionnée
    selectedVariant = signal<ProductVariantDTO | null>(null);

    // Prix affiché dynamique
    displayPrice = computed(() => {
        const v = this.selectedVariant();
        return v ? v.price : this.product().price;
    });

    stonesList = computed(() => {
        const stones = this.product()?.stones;
        return stones ? stones.map(s => s.name).join(', ') : '';
    });

    ngOnInit() {
        // Si le produit a des variantes, on sélectionne la première par défaut pour l'affichage
        const p = this.product();
        if (p.variants && p.variants.length > 0) {
            this.selectedVariant.set(p.variants[0]);
        }
    }

    selectVariant(event: Event, variant: ProductVariantDTO) {
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
            imageUrl: p.imageUrl ?? '',
            quantity: 1,
            type: p.type
        };

        this.cartStore.addToCart(item);
    }
}
