import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../../../services/product/product';
import {ToastService} from '../../../services/toast/toast';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 p-6 pb-24">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-serif text-spirit-primary">Administration</h1>
        <button routerLink="/admin/product/new" class="bg-spirit-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-spirit-primary/90 transition-colors">
          <mat-icon>add</mat-icon>
          Nouveau Produit
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase">Produit</th>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Type</th>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase">Prix</th>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (product of products(); track product.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4">
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-xs text-gray-400">{{ product.stone || '-' }}</div>
                </td>
                <td class="p-4 hidden md:table-cell">
                  <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        [class.bg-blue-100]="product.type === 'PHYSICAL'"
                        [class.text-blue-800]="product.type === 'PHYSICAL'"
                        [class.bg-purple-100]="product.type !== 'PHYSICAL'"
                        [class.text-purple-800]="product.type !== 'PHYSICAL'">
                    {{ product.type }}
                  </span>
                </td>
                <td class="p-4 text-gray-600 font-medium">{{ product.price }}€</td>
                <td class="p-4 text-right">
                  <div class="flex justify-end gap-2">
                    <button [routerLink]="['/admin/product', product.id]" class="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors z-10 relative">
                      <mat-icon class="text-base">edit</mat-icon>
                    </button>
                    <button (click)="deleteProduct(product.id)" class="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors z-10 relative">
                      <mat-icon class="text-base">delete</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="p-8 text-center text-gray-400 italic">Aucun produit pour le moment.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="mt-8 text-center">
        <a routerLink="/" class="text-sm text-gray-500 hover:text-spirit-primary underline">Retour au site</a>
      </div>
    </div>
  `
})
export class AdminDashboard {
  private productService = inject(ProductService);
  private toast = inject(ToastService);

  products = this.productService.allProducts;

  deleteProduct(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.toast.showSuccess('Produit supprimé'),
        error: () => this.toast.showError('Erreur lors de la suppression')
      });
    }
  }
}
