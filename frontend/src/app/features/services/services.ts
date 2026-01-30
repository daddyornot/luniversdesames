import { Component, effect, inject, Signal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BookingCalendar } from '../shop/booking-calendar/booking-calendar';
import { ToastService } from '../../services/toast/toast';
import { CartItem } from '../../core/models/cart';
import { RouterLink } from '@angular/router';
import { ProductDTO } from '../../core/api';
import { ProductStore } from '../../store/product.store';
import { CartStore } from '../../store/cart.store';

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [MatIconModule, BookingCalendar, RouterLink],
    templateUrl: './services.html',
    styleUrl: 'services.css'
})
export class Services {
    private readonly productStore = inject(ProductStore);
    private readonly cartStore = inject(CartStore);
    private readonly toast = inject(ToastService);

    allServices: Signal<ProductDTO[]> = this.productStore.serviceProducts;

    selectedService = signal<ProductDTO | null>(null);
    selectedSlot = signal<string | null>(null);

    openCalendar = signal(false);

    openBooking(service: ProductDTO) {
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
            imageUrl: service.imageUrl ?? '',
            quantity: 1,
            type: service.type,
            appointmentDate: slot
        };

        this.cartStore.addToCart(item);
        this.toast.showSuccess('Séance ajoutée au panier');
        this.closeBooking();
    }
}
