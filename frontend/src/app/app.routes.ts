import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  // Page d'accueil : Chargée immédiatement pour le SEO et la rapidité
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
    title: 'L\'Âme Zen - Accueil'
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then(m => m.AuthComponent),
    title: 'S\'authentifer'
  },
  // {
  //   path: 'mon-compte',
  //   component: MyAccountComponent,
  //   canActivate: [authGuard] // Protection active
  // },

  // // E-commerce : Les Bracelets
  {
    path: 'boutique',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/shop/shop-list/shop-list').then(m => m.ShopList),
        title: 'Nos Bracelets Énergétiques'
      },
      {
        path: ':id', // Détail d'un bracelet
        loadComponent: () => import('./features/shop/shop-item/shop-item').then(m => m.ShopItem)
      }
    ]
  },

  // Prestations : Coaching & Tirages
  {
    path: 'accompagnement',
    loadComponent: () => import('./features/services/services').then(m => m.Services),
    title: 'Coaching & Guidance'
  },

  // Tunnel de commande
  {
    path: 'panier',
    loadComponent: () => import('./features/cart/cart').then(m => m.Cart),
    title: 'Mon Panier Spirituel'
  },

  // Espace Client (Placeholder pour le futur back Spring Boot)
  // {
  //   path: 'mon-compte',
  //   loadComponent: () => import('./features/auth/profile/profile').then(m => m.ProfileComponent),
  // },

  // Redirection si la page n'existe pas
  { path: '**', redirectTo: '' }
];
