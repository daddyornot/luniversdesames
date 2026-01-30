import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShopItem } from '../shop/shop-item/shop-item';
import { RouterLink } from '@angular/router';
import { ProductDTO } from '../../core/api';
import { ProductStore } from '../../store/product.store';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatIconModule, CommonModule, ShopItem, RouterLink],
    templateUrl: './home.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
    private readonly productStore = inject(ProductStore);
    protected readonly ProductDTO = ProductDTO;

    protected bracelets = this.productStore.physicalProducts;
    protected services = this.productStore.serviceProducts;

    constructor() {
        this.productStore.loadAll();
    }

}
