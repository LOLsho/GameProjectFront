import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
import { AuthState } from '../store/reducers/auth.reducer';
import { RouterGo } from '../store/actions/router.actions';
import { getUser } from '../store/selectors/auth.selectors';
import { User } from './auth.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<AuthState>,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const url = route.url[0].path;

    if (url === 'authentication') {
      return this.getIsAuthenticated().pipe(
        map((authenticated: boolean) => !authenticated)
      );
    } else {
      return this.getIsAuthenticated().pipe(
        tap((authenticated: boolean) => {
          if (!authenticated) {
            this.store.dispatch(new RouterGo({ path: ['/authentication/sign-in'] }));
          }
        })
      );
    }
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.store.select(getUser).pipe(
      filter((user: User) => user !== null),
      map((user: User) => user.authenticated),
      take(1)
    );
  }
}
