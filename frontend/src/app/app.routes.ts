import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  // Page d'accueil
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

  // Administration
  // {
  //   path: 'admin',
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () => import('./features/admin/dashboard/admin-dashboard').then(m => m.AdminDashboard),
  //       title: 'Administration'
  //     },
  //     {
  //       path: 'product/new',
  //       loadComponent: () => import('./features/admin/product-form/product-form').then(m => m.ProductForm),
  //       title: 'Nouveau Produit'
  //     },
  //     {
  //       path: 'product/:id',
  //       loadComponent: () => import('./features/admin/product-form/product-form').then(m => m.ProductForm),
  //       title: 'Modifier Produit'
  //     }
  //   ]
  // },

  // Espace Client
  {
    path: 'mon-compte',
    canActivate: [authGuard],
    children: [
      {
        path: 'commandes',
        loadComponent: () => import('./features/auth/profile/profile').then(m => m.ProfileComponent),
        title: 'Mes Commandes'
      },
      { path: '', redirectTo: 'commandes', pathMatch: 'full' }
    ]
  },

  // E-commerce
  {
    path: 'boutique',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/shop/shop-list/shop-list').then(m => m.ShopList),
        title: 'Nos Bracelets Énergétiques'
      },
      {
        path: ':id',
        loadComponent: () => import('./features/shop/product-detail/product-detail').then(m => m.ProductDetail),
        title: 'Détail du produit'
      }
    ]
  },

  // Prestations
  {
    path: 'accompagnement',
    loadComponent: () => import('./features/services/services').then(m => m.Services),
    title: 'Coaching & Guidance'
  },

  // Panier & Paiement
  {
    path: 'panier',
    loadComponent: () => import('./features/cart/cart').then(m => m.Cart),
    title: 'Mon Panier Spirituel'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/cart/payment/payment').then(m => m.PaymentComponent),
    canActivate: [authGuard],
    title: 'Paiement Sécurisé'
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./features/cart/payment/payment-success').then(m => m.PaymentSuccessComponent),
    canActivate: [authGuard],
    title: 'Paiement Réussi'
  },

  // Pages Légales & Contact
  {
    path: 'mentions-legales',
    loadComponent: () => import('./features/legal/legal-mentions/legal-mentions').then(m => m.LegalMentionsComponent),
    title: 'Mentions Légales'
  },
  {
    path: 'cgv',
    loadComponent: () => import('./features/legal/cgv/cgv').then(m => m.CgvComponent),
    title: 'Conditions Générales de Vente'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then(m => m.ContactComponent),
    title: 'Contactez-nous'
  },

  { path: '**', redirectTo: '' }
];
