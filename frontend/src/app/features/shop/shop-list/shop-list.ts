import { Component, inject } from '@angular/core';
import { ShopItem } from '../shop-item/shop-item';
import { ProductStore } from '../../../store/product.store';

@Component({
    selector: 'app-shop-list',
    standalone: true,
    imports: [ShopItem],
    templateUrl: 'shop-list.html'
})
export class ShopList {
    private readonly productStore = inject(ProductStore);
    products = this.productStore.physicalProducts;
}
