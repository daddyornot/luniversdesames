import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../../../services/product/product';
import {CartService} from '../../../services/cart/cart';
import {Product, ProductVariant} from '../../../core/models/product';
import {CartItem} from '../../../core/models/cart';
import {ToastService} from '../../../services/toast/toast';
import {BookingCalendar} from '../booking-calendar/booking-calendar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, NgOptimizedImage, BookingCalendar],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  product = signal<Product | undefined>(undefined);
  selectedVariant = signal<ProductVariant | null>(null);
  selectedAppointment = signal<string | null>(null);

  // Prix affiché (soit celui de la variante, soit celui du produit de base)
  displayPrice = computed(() => {
    const v = this.selectedVariant();
    return v ? v.price : this.product()?.price;
  });

  // Nombre de séances affiché
  displaySessionCount = computed(() => {
    const v = this.selectedVariant();
    return v ? v.sessionCount : this.product()?.sessionCount;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const productSignal = this.productService.getProductById(id);
      // On s'abonne aux changements pour pré-sélectionner la 1ère variante si elle existe
      const p = productSignal();
      if (p) {
        this.product.set(p);
        if (p.variants && p.variants.length > 0) {
          this.selectedVariant.set(p.variants[0]);
        }
      }
    }
  }

  selectVariant(variant: ProductVariant) {
    this.selectedVariant.set(variant);
  }

  onSlotSelected(dateIso: string) {
    this.selectedAppointment.set(dateIso);
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    // Validation : Si ce n'est pas un produit physique, il faut une date
    if (p.type !== 'PHYSICAL' && !this.selectedAppointment()) {
      this.toast.showError('Veuillez choisir un créneau horaire');
      return;
    }

    const variant = this.selectedVariant();
    const finalPrice = variant ? variant.price : p.price;
    const finalName = variant ? `${p.name} - ${variant.label}` : p.name;

    const item: CartItem = {
      id: p.id, // On garde l'ID du produit parent pour l'instant (ou variant.id si le back le gère)
      name: finalName,
      price: finalPrice,
      image: p.imageUrl,
      quantity: 1,
      type: (p.type !== 'PHYSICAL') ? 'session' : 'bracelet',
      appointmentDate: this.selectedAppointment() || undefined
    };

    this.cartService.addToCart(item);
    this.toast.showSuccess('Ajouté au panier');
  }
}
