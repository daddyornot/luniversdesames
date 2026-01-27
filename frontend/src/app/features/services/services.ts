import {Component, inject, Signal, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../../services/product/product';
import {Product} from '../../core/models/product';
import {BookingCalendar} from '../shop/booking-calendar/booking-calendar';
import {CartService} from '../../services/cart/cart';
import {ToastService} from '../../services/toast/toast';
import {CartItem} from '../../core/models/cart';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatIconModule, BookingCalendar, RouterLink],
  templateUrl: './services.html',
  styleUrl: 'services.css'
})
export class Services {
  private readonly service = inject(ProductService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  allServices: Signal<Product[]> = toSignal(this.service.getServices(), {initialValue: []});

  selectedService = signal<Product | null>(null);
  selectedSlot = signal<string | null>(null);

  openCalendar = signal(false);

  openBooking(service: Product) {
    this.selectedService.set(service);
    this.selectedSlot.set(null);
    this.openCalendar.set(true);
  }

  closeBooking() {
    this.openCalendar.set(false);
    this.selectedService.set(null);
  }

  onSlotSelected(dateIso: string) {
    this.selectedSlot.set(dateIso);
  }

  confirmBooking() {
    const service = this.selectedService();
    const slot = this.selectedSlot();

    if (!service || !slot) return;

    const item: CartItem = {
      id: service.id,
      name: service.name,
      price: service.price,
      imageUrl: service.imageUrl,
      quantity: 1,
      type: service.type,
      appointmentDate: slot
    };

    this.cartService.addToCart(item);
    this.toast.showSuccess('Séance ajoutée au panier');
    this.closeBooking();
  }
}
