import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from "@angular/material/button";
import {ShopItem} from "../shop/shop-item/shop-item";
import {RouterLink} from "@angular/router";
import {ProductService} from "../../services/product/product";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatIconModule, CommonModule, MatIconButton, ShopItem, RouterLink],
    templateUrl: './home.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
    private readonly service = inject(ProductService)
    bracelets = this.service.bracelets
}
