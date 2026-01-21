import {isDevMode} from '@angular/core';

export const API_CONFIG = {
  // En DEV : On tape directement sur le backend (8080) pour éviter les soucis de résolution Docker/Nginx
  // En PROD : On utilisera le chemin relatif /api géré par Nginx
  baseUrl: isDevMode() ? 'http://localhost:8080/api' : '/api'
};
