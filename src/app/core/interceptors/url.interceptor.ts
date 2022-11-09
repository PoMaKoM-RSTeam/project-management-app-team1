import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const determinedUrl = request.url.startsWith('api')
      ? `${environment.baseUrl}${request.url.replace('api/', '')}`
      : request.url;

    const requestClone: HttpRequest<unknown> = request.clone({
      url: determinedUrl,
    });

    return next.handle(requestClone).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return throwError(() => errorResponse.status);
      })
    );
  }
}
