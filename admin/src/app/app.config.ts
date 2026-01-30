import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {ApiModule, Configuration} from './core/api';
import {environment} from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      ApiModule.forRoot(() => {
        return new Configuration({
          basePath: environment.apiUrl // Utilise '/api' (dev) ou l'URL complète (prod)
        });
      })
    )
  ]
};
