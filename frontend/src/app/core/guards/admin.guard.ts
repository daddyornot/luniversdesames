import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../auth/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Vérification via le Service
  const isAuthService = auth.isAuthenticated();

  // 2. Vérification brute via LocalStorage (Debug)
  const rawToken = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');
  const isAuthRaw = !!rawToken && !!rawUser;

  console.group('🛡️ AdminGuard Debug');
  console.log('URL demandée:', state.url);
  console.log('AuthService dit:', isAuthService);
  console.log('LocalStorage dit:', isAuthRaw ? 'Présent' : 'Absent', {token: !!rawToken, user: !!rawUser});
  console.groupEnd();

  if (isAuthService) {
    return true;
  }

  // Si le service dit non, mais que le storage est là, il y a un problème de synchro
  if (!isAuthService && isAuthRaw) {
    console.warn('⚠️ ALERTE: LocalStorage présent mais AuthService dit non connecté !');
    // On pourrait tenter de forcer un reload du user ici, mais c'est le rôle du service
  }

  console.log('⛔ Accès refusé -> Redirection /auth');
  router.navigate(['/auth']);
  return false;
};
