import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './auth/auth.interface';
import { filter } from 'rxjs/operators';
import { emersionAnimation } from './animations/emersion.animation';
import { selectAuthUser } from '@store/auth-store/selectors';
import { GetUser } from '@store/auth-store/actions';
import { AppState } from '@store/state';


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
  ) {}
}
