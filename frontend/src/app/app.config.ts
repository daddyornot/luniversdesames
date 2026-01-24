import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions} from '@angular/router';
import {provideClientHydration} from '@angular/platform-browser';

import {routes} from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {provideNgxStripe} from 'ngx-stripe';

console.log('Routes configuration:', routes);
routes.forEach((r, i) => {
  if (!r) console.error(`Route at index ${i} is undefined!`);
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    // Remplacez par votre clé publique Stripe de test
    provideNgxStripe('pk_test_51Ss298HFTqvl1QymK8LgVzlsKNBPFlBmFSKTfoWVYeFsDfjMvUOugQKZ3OSw7qd0KvSB2BbYL6OoljioY5bls57W00lYT7csOE')
  ]
};
