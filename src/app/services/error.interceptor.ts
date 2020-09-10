import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) return throwError(err.statusText);

        if (err instanceof HttpErrorResponse) {
          const appError = err.headers.get('Application-Error');
          if (appError) return throwError(appError);
        }

        const serverError = err.error;
        let modalStateErrors = '';

        if (serverError.errors && typeof serverError.errors === 'object') {
          for (const k in serverError.errors)
            if (serverError.errors[k])
              modalStateErrors += serverError.errors[k] + '\n';
        }

        return throwError(modalStateErrors || serverError || 'Server Error');
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
