import {Component, signal} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatIconModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './services.html',
  styleUrl: 'services.css'
})
export class Services {
  // Données des Tirages
  tirages = signal([
    {id: 1, title: 'Tirage Flash (3 cartes)', price: 25, duration: '20 min'},
    {id: 2, title: 'Grand Tirage Roue de l\'Année', price: 60, duration: '1h'}
  ]);

  // Données Coaching
  coachingPack = signal([
    {
      id: 101,
      title: 'Séance Renaissance',
      price: 85,
      description: 'Un voyage intérieur pour débloquer vos peurs et retrouver votre souveraineté.',
      image: 'assets/images/wellness-285590_1280.jpg'
    },
    {
      id: 102,
      title: 'Séance Accompagnement',
      price: 185,
      description: 'Un voyage intérieur pour débloquer vos peurs et retrouver votre souveraineté.',
      image: 'assets/images/pexels-ekaterina-bolovtsova-6766456.jpg'
    }
  ]);

  // Gestion de la sélection pour le RDV
  selectedService = signal<any>(null);
  selectedDate = signal<Date | null>(null);

  openBooking(service: any) {
    this.selectedService.set(service);
  }

  confirmDate() {
    console.log(`RDV confirmé pour ${this.selectedService().title} le ${this.selectedDate()}`);
    // Ici, tu pourras envoyer les infos vers Spring Boot plus tard
    this.selectedService.set(null);
  }
}
