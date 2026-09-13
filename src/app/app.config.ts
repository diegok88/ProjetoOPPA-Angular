import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from './constants/credentials-interceptor.const';
import { provideNgxMask } from 'ngx-mask';
import { ErrorInterceptorService } from './services/error-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor]), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    /* CONFIGURAÇÃO QUE PERMITE */
    provideNgxMask({
      patterns: {
        '0': {
          pattern: /\d/,
        },
        '9': {
          pattern: /\d/,
        },
        // Letras + acentos + espaços
        S: {
          pattern: /[a-zA-ZÀ-ÿ ]/,
        },
        // Letras + números
        A: {
          pattern: /[a-zA-Z0-9 ]/,
        },
        // Padrão para e-mail: letras, números, @, ., -, _
        E: {
          pattern: /[a-zA-Z0-9@._\-]/,
        },
      },
    }),
  ],
};
