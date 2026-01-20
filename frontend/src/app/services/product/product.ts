import {computed, inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {Product} from '../../core/models/product';

@Injectable({providedIn: 'root'})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/products';

  // 1. On récupère les données du Back (Observable -> Signal)
  // On met une valeur initiale [] pour éviter que le signal soit 'undefined' au début
  private productsSource = toSignal(this.http.get<Product[]>(this.apiUrl), {initialValue: []});

  // 2. On expose des signaux calculés (très performant)
  readonly allProducts = computed(() => this.productsSource());

  readonly bracelets = computed(() =>
    this.productsSource().filter(p => p.category === 'bracelet')
  );

  readonly services = computed(() =>
    this.productsSource().filter(p => p.category === 'service')
  );
}
