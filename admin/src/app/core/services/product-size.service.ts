import {inject, Injectable, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductSize} from '../models/product';

@Injectable({providedIn: 'root'})
export class ProductSizeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = isDevMode() ? 'http://localhost:8080/api/sizes' : '/api/sizes';

  getAllSizes() {
    return this.http.get<ProductSize[]>(this.apiUrl);
  }

  createSize(size: Partial<ProductSize>) {
    return this.http.post<ProductSize>(this.apiUrl, size);
  }

  deleteSize(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
