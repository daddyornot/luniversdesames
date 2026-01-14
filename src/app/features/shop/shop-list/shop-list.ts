import {Component, signal} from '@angular/core';
import {ShopItem} from '../shop-item/shop-item';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [ShopItem],
  template: `
    <div class="min-h-screen pb-24">
      <div class="px-6 py-8">
        <h2 class="font-serif text-3xl text-spirit-primary">Nos Créations</h2>
        <p class="text-gray-500 text-sm mt-1">Bracelets infusés d'intentions positives.</p>

        <div class="flex gap-3 mt-6 overflow-x-auto no-scrollbar">
          @for (filter of categories(); track filter) {
            <button
              class="px-5 py-2 rounded-full border border-gray-100 bg-white text-xs font-medium whitespace-nowrap active:bg-spirit-primary active:text-white transition-colors">
              {{ filter }}
            </button>
          }
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 px-4">
        @for (item of bracelets(); track item.id) {
          <app-shop-item [product]="item"></app-shop-item>
        } @empty {
          <p class="col-span-2 text-center py-20 text-gray-400 italic">Aucun bracelet trouvé...</p>
        }
      </div>
    </div>
  `
})
export class ShopList {
  categories = signal(['Tous', 'Protection', 'Amour', 'Énergie', 'Sommeil']);

  bracelets = signal([
    {id: '1', name: 'Aura de Quartz', price: 45, stone: 'Quartz Rose', image: 'assets/images/hoylee-song-TsbJvGJ0RwY-unsplash.jpg', type: 'bracelet'},
    {id: '2', name: 'Bouclier Noir', price: 49, stone: 'Obsidienne', image: 'assets/images/alexey-demidov-WTKBeM7rGQE-unsplash.jpg', type: 'bracelet'},
    {id: '3', name: 'Sagesse Bleue', price: 55, stone: 'Lapis Lazuli', image: 'assets/images/alexey-demidov-QRnUMyfhpgA-unsplash.jpg', type: 'bracelet'},
    {id: '4', name: 'Feu Intérieur', price: 42, stone: 'Cornaline', image: 'assets/images/hoylee-song-TsbJvGJ0RwY-unsplash.jpg', type: 'bracelet'},
  ]);
}
