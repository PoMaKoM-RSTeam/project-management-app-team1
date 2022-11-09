import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserStatusService } from '../services/user-status.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private userService: UserStatusService, private _loading: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this._loading.setLoading(true, request.url);
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

    return next.handle(requestClone)
      .pipe(catchError((errorResponse: HttpErrorResponse) => {
        this._loading.setLoading(false, request.url);
        if (errorResponse.status === 401 || errorResponse.status === 403) {
          this.router.navigate(['login']);
        }

        return throwError(() => errorResponse);
      })
      )
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this._loading.setLoading(false, request.url);
        }
        return evt;
      }));
  }
}
