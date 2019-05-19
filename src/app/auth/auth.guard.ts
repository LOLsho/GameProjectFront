import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
import { User } from './auth.interface';
import { AppState } from '@store/state';
import { RouterGo } from '@store/router-store/actions';
import { selectAuthUser } from '@store/auth-store/selectors';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<AppState>,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const url = route.url[0].path;

    if (url === 'authentication') {
      return this.getIsAuthenticated().pipe(
        map((authenticated: boolean) => !authenticated),
      );
    } else {
      return this.getIsAuthenticated().pipe(
        tap((authenticated: boolean) => {
          if (!authenticated) {
            this.store.dispatch(new RouterGo({ path: ['/authentication/sign-in'] }));
          }
        }),
      );
    }
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.store.select(selectAuthUser).pipe(
      filter((user: User) => user !== null),
      map((user: User) => user.authenticated),
      take(1),
    );
  }
}
