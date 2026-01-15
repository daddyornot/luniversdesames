import {Component, inject, Signal, signal, WritableSignal} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {ProductService} from '../../services/product/product';
import {ProductDTO} from '../../core/models/ProductDTO';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatIconModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './services.html',
  styleUrl: 'services.css'
})
export class Services {
  private readonly service = inject(ProductService)

  // Données des Tirages
  // tirages = signal([
  //   {id: 1, title: 'Tirage Flash (3 cartes)', price: 25, duration: '20 min'},
  //   {id: 2, title: 'Grand Tirage Roue de l\'Année', price: 60, duration: '1h'}
  // ]);

  // Données Coaching
  coachingPack: Signal<ProductDTO[]> = this.service.services

  // Gestion de la sélection pour le RDV
  selectedService = signal<ProductDTO | null>(null);
  selectedDate = signal<Date | null>(null);

  openCalendar = signal(false);

  openBooking(service: ProductDTO) {
    this.selectedService.set(service)
    this.openCalendar.set(true);
  }

  confirmDate() {
    console.log(`RDV confirmé pour ${this.selectedService()?.name} le ${this.selectedDate()}`);
    // Ici, tu pourras envoyer les infos vers Spring Boot plus tard
    this.openCalendar.set(false);
    this.selectedService.set(null)
  }
}
