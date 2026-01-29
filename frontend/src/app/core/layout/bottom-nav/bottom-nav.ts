import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth';
import { CartStore } from '../../../store/cart.store';

@Component({
    selector: 'app-bottom-nav',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, MatIconModule],
    templateUrl: 'bottom-nav.html'
})
export class BottomNavComponent {
    private readonly cartStore = inject(CartStore);
    auth = inject(AuthService);
    cartCount = this.cartStore.count;
}
