import {Component, inject, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CartService} from '../../../services/cart/cart';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-shop-item',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: 'shop-item.html'
})
export class ShopItem {
  private http = inject(HttpClient);
  // Déclaration du signal d'entrée
  product = input.required<any>();
  private cartService = inject(CartService);

  protected addToCart(event: Event) {
    event.stopPropagation(); // Évite de naviguer vers le détail au clic sur le bouton
    this.cartService.addToCart({...this.product(), quantity: 1});
  }

  checkout() {
    const cartItems = this.cartService.items(); // Récupère le signal

    const payload = {
      customerName: "Jean Zen", // À lier à un formulaire
      customerEmail: "jean@zen.com",
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    this.http.post('http://localhost:8080/api/orders', payload).subscribe({
      next: (res) => {
        console.log('Commande réussie !', res);
        this.cartService.clearCart();
        // Redirection vers page succès
      },
      error: (err) => alert("Erreur lors de la commande")
    });
  }
}
