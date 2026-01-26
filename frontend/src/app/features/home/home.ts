import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ShopItem} from "../shop/shop-item/shop-item";
import {RouterLink} from "@angular/router";
import {ProductService} from "../../services/product/product";
import {Product} from "../../core/models/product";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, CommonModule, ShopItem, RouterLink],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  private readonly service = inject(ProductService);

  bracelets = signal<Product[]>([]);
  services = signal<Product[]>([]);

  ngOnInit() {
    this.service.getProductsByType('PHYSICAL').subscribe(products => {
      this.bracelets.set(products);
    });
    this.service.getServices().subscribe(services => {
      this.services.set(services);
    });
  }
}
