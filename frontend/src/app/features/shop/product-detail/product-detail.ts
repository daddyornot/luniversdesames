import { Component, computed, effect, inject, input, numberAttribute, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BookingCalendar } from '../booking-calendar/booking-calendar';
import { ProductDTO, ProductSizeDTO, ProductVariantDTO } from '../../../core/api';
import { ProductStore } from '../../../store/product.store';
import { CartStore } from '../../../store/cart.store';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, MatIconModule, BookingCalendar, RouterLink],
    templateUrl: './product-detail.html'
})
export class ProductDetail {
    public readonly id = input.required({ transform: numberAttribute });

    private readonly store = inject(ProductStore);
    private readonly cartStore = inject(CartStore);

    // États locaux pour la sélection
    selectedVariant = signal<ProductVariantDTO | undefined>(undefined);
    selectedSize = signal<ProductSizeDTO | undefined>(undefined);
    selectedAppointment = signal<string | undefined>(undefined);

    // Raccourci vers le produit sélectionné dans le store
    product: Signal<ProductDTO | null> = this.store.selectedProduct;

    displayPrice = computed(() => {
        const variant = this.selectedVariant();
        if (variant) return variant.price;
        return this.product()?.price;
    });

    displaySessionCount = computed(() => {
        const variant = this.selectedVariant();
        if (variant) return variant.sessionCount;
        return this.product()?.sessionCount;
    });

    constructor() {
        // Déclenche le chargement hybride dès que l'ID change
        // L'effet de bord gère aussi les sélections par défaut une fois chargé
        this.store.getById(this.id);

        // On réinitialise les sélections quand le produit change
        // On utilise un effect ici car c'est une réaction à un changement de donnée externe (le store)
        effect(() => {
            const p = this.product();
            if (p) {
                if (p.variants?.length && !this.selectedVariant()) {
                    this.selectedVariant.set(p.variants[0]);
                }
                if (p.sizes?.length && !this.selectedSize()) {
                    this.selectedSize.set(p.sizes[0]);
                }
            }
        });
    }

    selectVariant(variant: ProductVariantDTO) {
        this.selectedVariant.set(variant);
    }

    selectSize(size: ProductSizeDTO) {
        this.selectedSize.set(size);
    }

    onSlotSelected(slot: string) {
        this.selectedAppointment.set(slot);
    }

    addToCart() {
        const p = this.product();
        if (!p) return;

        const variant = this.selectedVariant();
        const size = this.selectedSize();

        let finalName = p.name;
        if (variant) finalName += ` - ${variant.label}`;
        if (size) finalName += ` - ${size.label}`;

        this.cartStore.addToCart({
            id: p.id,
            name: finalName,
            price: variant?.price ?? p.price ?? 0,
            imageUrl: p.imageUrl ?? '',
            quantity: 1,
            type: p.type as any, // Cast si nécessaire selon ton interface CartItem
            appointmentDate: this.selectedAppointment()
        });
    }

    protected readonly ProductDTO = ProductDTO;
}
