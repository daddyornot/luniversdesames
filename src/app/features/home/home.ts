import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, ProductCardComponent, CommonModule],
  templateUrl: './home.component.html'
})
export class Home {
  // Mock des données pour le front-end
  featuredBracelets = signal([
    { id: 1, name: 'Améthyste Pure', price: 42, image: '...' },
    { id: 2, name: 'Quartz Rose', price: 38, image: '...' },
    { id: 3, name: 'Oeil de Tigre', price: 45, image: '...' }
  ]);
}
