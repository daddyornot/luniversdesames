import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ShopItem} from "../shop/shop-item/shop-item";
import {RouterLink} from "@angular/router";
import {ProductService} from "../../services/product/product";
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, CommonModule, ShopItem, RouterLink],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly service = inject(ProductService);

  bracelets = toSignal(this.service.getProductsByType('PHYSICAL'), {initialValue: []});
  services = toSignal(this.service.getServices(), {initialValue: []});
}
