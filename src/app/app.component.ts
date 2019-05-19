import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './auth/auth.interface';
import { filter, map, tap } from 'rxjs/operators';
import { emersionAnimation } from './animations/emersion.animation';
import { selectAuthState, selectAuthUser } from '@store/auth-store/selectors';
import { GetUser } from '@store/auth-store/actions';
import { AppState } from '@store/state';
import { selectRouterState } from '@store/router-store/selectors';


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  animations: [emersionAnimation],
})
export class AppComponent {

  user$: Observable<User> = this.store.select(selectAuthUser).pipe(
    filter((user: User) => {
      if (!user) this.store.dispatch(new GetUser());
      return !!user;
    }),
  );

  constructor(
    private store: Store<AppState>,
  ) {


    setTimeout(() => {
      console.log('before test', this.store);

      this.store.select(selectRouterState).pipe(
        map((state) => console.log('state:', state)),
        tap((routerState) => console.log('routerState:', routerState))
      );

      this.store.select(selectAuthState).pipe(
        tap((user) => console.log('USER:', user))
      );
    }, 5000);

  }
}
