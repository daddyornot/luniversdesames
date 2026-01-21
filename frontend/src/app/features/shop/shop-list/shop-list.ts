import {Component, inject, OnInit, signal} from '@angular/core';
import {ShopItem} from '../shop-item/shop-item';
import {ProductService} from '../../../services/product/product';
import {Product} from '../../../core/models/product';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [ShopItem],
  templateUrl: 'shop-list.html'
})
export class ShopList implements OnInit {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);

  ngOnInit() {
    this.productService.getProductsByType('PHYSICAL').subscribe(products => {
      this.products.set(products);
    });
  }
}
