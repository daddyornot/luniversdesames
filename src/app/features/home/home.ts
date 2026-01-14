import {Component, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from "@angular/material/button";
import {ShopItem} from "../shop/shop-item/shop-item";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatIconModule, CommonModule, MatIconButton, NgOptimizedImage, ShopItem],
    templateUrl: './home.html'
})
export class Home {

    bracelets = signal([
        {
            id: '1',
            name: 'Aura de Quartz',
            price: 45,
            stone: 'Quartz Rose',
            image: 'assets/images/hoylee-song-TsbJvGJ0RwY-unsplash.jpg',
            type: 'bracelet'
        },
        {
            id: '2',
            name: 'Bouclier Noir',
            price: 49,
            stone: 'Obsidienne',
            image: 'assets/images/alexey-demidov-WTKBeM7rGQE-unsplash.jpg',
            type: 'bracelet'
        },
        {
            id: '3',
            name: 'Sagesse Bleue',
            price: 55,
            stone: 'Lapis Lazuli',
            image: 'assets/images/alexey-demidov-QRnUMyfhpgA-unsplash.jpg',
            type: 'bracelet'
        },
        {
            id: '4',
            name: 'Feu Intérieur',
            price: 42,
            stone: 'Cornaline',
            image: 'assets/images/hoylee-song-TsbJvGJ0RwY-unsplash.jpg',
            type: 'bracelet'
        },
    ]);

}
