import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/layout/layout';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    title: 'Connexion Admin'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
        title: 'Dashboard'
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders').then(m => m.OrdersComponent),
        title: 'Commandes'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products').then(m => m.ProductsComponent),
        title: 'Produits'
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users').then(m => m.UsersComponent),
        title: 'Utilisateurs'
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserFormComponent),
        title: 'Nouvel Utilisateur'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
