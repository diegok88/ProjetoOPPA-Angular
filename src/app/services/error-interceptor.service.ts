import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensagens: string[] = ['Erro inesperado.'];

        if (error.error) {
          if (typeof error.error === 'object' && error.error.message) {
            const msg = error.error.message;
            mensagens = Array.isArray(msg) ? msg : [String(msg)];
          } else if (typeof error.error === 'string') {
            mensagens = [error.error];
          } else if (
            Array.isArray(error.error) &&
            error.error.every((i) => typeof i === 'string')
          ) {
            mensagens = error.error;
          } else if (typeof error.error === 'object') {
            const possible = error.error.error || error.error.msg || error.error.message;
            mensagens = possible
              ? Array.isArray(possible)
                ? possible
                : [String(possible)]
              : [JSON.stringify(error.error)];
          }
        } else if (error.message) {
          mensagens = [error.message];
        }

        console.error('Erro capturado:', mensagens);

        return throwError(() => mensagens);
      }),
    );
  }
}
