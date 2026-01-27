import {Component, inject} from '@angular/core';
import {ShopItem} from '../shop-item/shop-item';
import {ProductService} from '../../../services/product/product';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [ShopItem],
  templateUrl: 'shop-list.html'
})
export class ShopList {
  private productService = inject(ProductService);
  products = toSignal(this.productService.getProductsByType('PHYSICAL'), {initialValue: []});
}
