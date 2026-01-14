import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home')
      .then(m => m.Home)
  },
  // {
  //   path: 'profile/:id',
  //   loadComponent: () => import('./features/profile/profile.component')
  //     .then(m => m.ProfileComponent),
  //   // Protection de la route
  //   canActivate: [() => inject(AuthService).isLoggedIn()]
  // },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', loadComponent: () => import('./shared/not-found/not-found') }
];
