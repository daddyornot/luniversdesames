import {computed, inject, Injectable, signal} from '@angular/core';
import {Product, ProductType} from '../../core/models/product';
import {ApiService} from '../../core/services/api.service';
import {tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProductService {
  private api = inject(ApiService);

  // State (Source de vérité)
  private state = signal<{
    products: Product[];
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    loading: false,
    error: null
  });

  // Selectors
  readonly products = computed(() => this.state().products);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  readonly bracelets = computed(() =>
    this.products().filter(p => p.type === 'PHYSICAL')
  );

  readonly services = computed(() =>
    this.products().filter(p => p.type !== 'PHYSICAL')
  );

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.state.update(s => ({...s, loading: true}));
    this.api.get<Product[]>('products').subscribe({
      next: (products) => {
        this.state.update(s => ({...s, products, loading: false}));
      },
      error: (err) => {
        console.error('Erreur chargement produits', err);
        this.state.update(s => ({...s, error: 'Impossible de charger les produits', loading: false}));
      }
    });
  }

  getProductById(id: string | number) {
    return computed(() =>
      this.products().find(p => p.id.toString() === id.toString())
    );
  }

  // Méthodes spécifiques pour le backend (si besoin de filtrage serveur)
  getProductsByType(type: string) {
    return this.api.get<Product[]>(`products?type=${type}`);
  }

  getPhysicalProducts() {
    return this.api.get<Product[]>('products/physical');
  }

  getServices() {
    return this.api.get<Product[]>('products/services');
  }
}
