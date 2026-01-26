import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {LocalStorageService} from '../local-storage/local-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService)
  const token = localStorageService.getItem('token');

  // Si on a un token, on l'ajoute à la requête
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Sinon, on laisse passer la requête telle quelle
  return next(req);
};
