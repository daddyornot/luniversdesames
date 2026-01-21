import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
// import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    // provideClientHydration(withEventReplay()), // Désactivé pour éviter les conflits SSR/LocalStorage
    provideHttpClient(withFetch(), withInterceptors([authInterceptor]))
  ]
};
