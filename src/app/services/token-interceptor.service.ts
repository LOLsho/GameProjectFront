import { forwardRef, Injectable, Injector } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Router } from '@angular/router';


export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: forwardRef(() => TokenInterceptorService),
  multi: true,
};

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isLoggedIn) {
      req = req.clone({
        setHeaders: {
          Authorization: this.authService.token,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleAuthError(error)),
    );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.router.navigate(['/authentication/sign-in']);
    }

    return throwError(error);
  }
}
