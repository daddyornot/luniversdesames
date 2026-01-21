import {Component, inject, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../../../services/product/product';
import {ToastService} from '../../../services/toast/toast';
import {Product} from '../../../core/models/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class AdminDashboard {
  productService = inject(ProductService);
  private toast = inject(ToastService);

  products: Signal<Product[]> = this.productService.allProducts;

  deleteProduct(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.toast.showSuccess('Produit supprimé'),
        error: () => this.toast.showError('Erreur lors de la suppression')
      });
    }
  }
}
