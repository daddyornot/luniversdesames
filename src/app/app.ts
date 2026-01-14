import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CartService} from "./services/cart";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, MatIconButton, MatIcon, RouterLinkActive],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    private cartService = inject(CartService);

    // On expose le signal pour le template
    cartCount = this.cartService.count;
}
