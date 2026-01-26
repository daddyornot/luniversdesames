import {computed, inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Product} from '../../core/models/product';
import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';
import {ApiService} from '../../core/services/api.service';

@Injectable({providedIn: 'root'})
export class ProductService {
  private api = inject(ApiService);
  private refreshTrigger = new BehaviorSubject<void>(undefined);

  private productsSource = toSignal(
    this.refreshTrigger.pipe(
      switchMap(() => this.api.get<Product[]>('products'))
    ),
    {initialValue: []}
  );

  readonly allProducts = computed(() => this.productsSource());

  readonly bracelets = computed(() =>
    this.allProducts().filter(p => p.type === 'PHYSICAL')
  );

  readonly services = computed(() =>
    this.allProducts().filter(p => p.type !== 'PHYSICAL')
  );

  getProductById(id: string | number) {
    return computed(() =>
      this.allProducts().find(p => p.id.toString() === id.toString())
    );
  }

  getProductsByType(type: string): Observable<Product[]> {
    return this.api.get<Product[]>(`products?type=${type}`);
  }

  getServices(): Observable<Product[]> {
    return this.api.get<Product[]>('products/services');
  }

  refresh() {
    this.refreshTrigger.next();
  }

  createProduct(product: any) {
    return this.api.post('products', product).pipe(tap(() => this.refresh()));
  }

  updateProduct(id: number, product: any) {
    return this.api.put(`products/${id}`, product).pipe(tap(() => this.refresh()));
  }

  deleteProduct(id: number) {
    return this.api.delete(`products/${id}`).pipe(tap(() => this.refresh()));
  }
}
