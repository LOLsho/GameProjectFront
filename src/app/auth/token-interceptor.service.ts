import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/internal/Observable";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptorService implements HttpInterceptor{

  constructor(
    private injector: Injector,
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('authService.getToken - ', this.authService.getToken());

    if (this.authService.isLoggedIn()) {
      req = req.clone({
        setHeaders: {
          Authorizateion: this.authService.getToken()
        }
      })
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.router.navigate(['/authentication/sign-in']);
    }

    return throwError(error);
  }
}
