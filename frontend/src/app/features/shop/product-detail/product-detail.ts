import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product, ProductSize} from '../../../core/models/product';
import {ProductService} from '../../../services/product/product';
import {CartService} from '../../../services/cart/cart';
import {ProductVariant} from '../../../core/models/product-variant';
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Since getProductById returns a computed signal, we can read it.
        // But we need to react when it updates (data loaded).
        // A simple way is to use an effect in constructor, but here we are in ngOnInit.
        // We can use a workaround or just poll it? No.

        // Better: ProductService should expose a way to get product by ID as observable or we use the signal in template directly.
        // But we need to set selectedVariant.

        // Let's assume we can just read the signal in the template, and use an effect for side effects.
        // But effect() must be in injection context.

        // I'll use a manual subscription to the service's source if possible, or just use the signal in template.
        // But I need to set selectedVariant.

        // I'll use `toObservable` on the signal?

        // For now, I'll just use the signal in the template and use a computed for selectedVariant default?
        // No, selectedVariant is user selection.

        // I'll use a simple approach:
        const pSignal = this.productService.getProductById(id);
        // We can't subscribe to a signal.

        // I'll change the logic to use `effect` in constructor.
      }
    });
  }

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
