import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product, ProductSize, ProductVariant} from '../../../core/models/product';
import {ProductService} from '../../../services/product/product';
import {CartService} from '../../../services/cart/cart';
import {BookingCalendar} from '../booking-calendar/booking-calendar';
import {CartItem} from '../../../core/models/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, BookingCalendar],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  selectedVariant = signal<ProductVariant | undefined>(undefined);
  selectedAppointment = signal<string | undefined>(undefined);
  selectedSize = signal<ProductSize | undefined>(undefined);

  displayPrice = computed(() => {
    if (this.selectedVariant()) {
      return this.selectedVariant()!.price;
    }
    return this.product()?.price;
  });

  displaySessionCount = computed(() => {
    if (this.selectedVariant()) {
      return this.selectedVariant()!.sessionCount;
    }
    return this.product()?.sessionCount;
  });

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        const p = this.productService.getProductById(id)();
        if (p) {
          this.product.set(p);
          if (p.variants && p.variants.length > 0 && !this.selectedVariant()) {
            this.selectedVariant.set(p.variants[0]);
          }
          if (p.sizes && p.sizes.length > 0 && !this.selectedSize()) {
            this.selectedSize.set(p.sizes[0]);
          }
        }
      }
    });
  }

  ngOnInit() {
    // L'initialisation est gérée par l'effect dans le constructeur
  }

  selectVariant(variant: ProductVariant) {
    this.selectedVariant.set(variant);
  }

  selectSize(size: ProductSize) {
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

    const item: CartItem = {
      id: p.id,
      name: finalName,
      price: variant ? variant.price : p.price,
      imageUrl: p.imageUrl,
      quantity: 1,
      type: p.type,
      appointmentDate: this.selectedAppointment()
    };

    this.cartService.addToCart(item);
  }
}
