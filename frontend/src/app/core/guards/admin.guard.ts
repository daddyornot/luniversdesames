import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../auth/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Vérification via le Service
  const isAuthService = auth.isAuthenticated();

  if (isAuthService) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};
