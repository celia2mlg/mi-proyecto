import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './Helpers/auth.interceptor';


//TENEMOS QUE AÑADIR provideHttpClient(withFetch())
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withFetch()), 
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS, useClass:authInterceptor, multi:true
    }    
  ]
};
