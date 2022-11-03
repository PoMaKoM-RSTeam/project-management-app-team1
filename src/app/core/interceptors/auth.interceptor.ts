import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserStatusService } from '../services/user-status.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private userService: UserStatusService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let requestClone: HttpRequest<unknown> = request;

    if (
      request.url.startsWith(environment.baseUrl) &&
      !(
        request.url.startsWith(environment.baseUrl + 'signup') ||
        request.url.startsWith(environment.baseUrl + 'signin')
      )
    ) {
      requestClone = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.userService.token}`,
        },
      });
    }
    console.log('requestClone', requestClone);
    return next.handle(requestClone).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401 || errorResponse.status === 403) {
          this.router.navigate(['/auth/login']).then();
        }
        return throwError(() => {
          return new Error(`${errorResponse.message}`);
        });
      })
    );
  }
}
