import {Component, computed, inject, signal} from '@angular/core';
import {ShopItem} from '../shop-item/shop-item';
import {ProductService} from '../../../services/product/product';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [ShopItem],
  template: `
    <div class="min-h-screen pb-24">
      <div class="px-6 py-8">
        <h2 class="font-serif text-3xl text-spirit-primary">Boutique</h2>
        <p class="text-gray-500 text-sm mt-1">Soins, Guidances et Créations artisanales.</p>

        <div class="flex gap-3 mt-6 overflow-x-auto no-scrollbar">
          @for (filter of categories(); track filter) {
            <button
              (click)="activeFilter.set(filter)"
              [class.bg-spirit-primary]="activeFilter() === filter"
              [class.text-white]="activeFilter() === filter"
              [class.bg-white]="activeFilter() !== filter"
              class="px-5 py-2 rounded-full border border-gray-100 text-xs font-medium whitespace-nowrap transition-colors">
              {{ filter }}
            </button>
          }
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 px-4">
        @for (item of filteredProducts(); track item.id) {
          <app-shop-item [product]="item"></app-shop-item>
        } @empty {
          <p class="col-span-2 text-center py-20 text-gray-400 italic">Aucun produit trouvé...</p>
        }
      </div>
    </div>
  `
})
export class ShopList {
  private productService = inject(ProductService);

  // Filtres
  categories = signal(['Tous', 'Bracelets', 'Services', 'Coaching']);
  activeFilter = signal('Tous');

  // Produits filtrés
  filteredProducts = computed(() => {
    const all = this.productService.allProducts(); // On prend TOUS les produits
    const filter = this.activeFilter();

    if (filter === 'Tous') return all;

    if (filter === 'Bracelets') {
      return all.filter(p => p.type === 'PHYSICAL');
    }
    if (filter === 'Services') {
      return all.filter(p => p.type === 'ENERGY_CARE' || p.type === 'CARD_READING');
    }
    if (filter === 'Coaching') {
      return all.filter(p => p.type === 'COACHING');
    }

    return all;
  });
}
