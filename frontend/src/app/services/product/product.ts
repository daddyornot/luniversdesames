// import { computed, inject, Injectable, signal } from '@angular/core';
// import { ProductControllerService, ProductDTO } from '../../core/api';
//
// @Injectable({ providedIn: 'root' })
// export class ProductService {
//     private readonly api = inject(ProductControllerService);
//
//     constructor() {
//         this.loadProducts();
//     }
//
//     loadProducts() {
//         this.state.update(s => ({ ...s, loading: true }));
//         this.api.getAllProducts().subscribe({
//             next: (products) => {
//                 this.state.update(s => ({ ...s, products, loading: false }));
//             },
//             error: (err) => {
//                 console.error('Erreur chargement produits', err);
//                 this.state.update(s => ({ ...s, error: 'Impossible de charger les produits', loading: false }));
//             }
//         });
//     }
//
//     getProductById(id: string | number) {
//         return computed(() =>
//             this.products().find(p => p.id.toString() === id.toString())
//         );
//     }
//
//     getPhysicalProducts() {
//         return this.api.getAllPhysicalProducts();
//     }
//
//     getServices() {
//         return this.api.getAllServices();
//     }
// }
