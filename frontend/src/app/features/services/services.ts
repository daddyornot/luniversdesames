import {Component, inject, OnInit, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../../services/product/product';
import {Product} from '../../core/models/product';
import {BookingCalendar} from '../shop/booking-calendar/booking-calendar';
import {CartService} from '../../services/cart/cart';
import {ToastService} from '../../services/toast/toast';
import {CartItem} from '../../core/models/cart';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatIconModule, BookingCalendar],
  templateUrl: './services.html',
  styleUrl: 'services.css'
})
export class Services implements OnInit {
  private readonly service = inject(ProductService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  // Données Coaching
  coachingPack = signal<Product[]>([]);

  // Gestion de la sélection pour le RDV
  selectedService = signal<Product | null>(null);
  selectedSlot = signal<string | null>(null); // Date ISO complète avec heure

  openCalendar = signal(false);

  ngOnInit() {
    this.service.getServices().subscribe(services => {
      this.coachingPack.set(services);
    });
  }

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
      type: service.type, // Utilise le type du service
      appointmentDate: slot
    };

    this.cartService.addToCart(item);
    this.toast.showSuccess('Séance ajoutée au panier');
    this.closeBooking();
  }
}
