import { Component } from '@angular/core';
import { GetUser } from './store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers';
import { Observable } from 'rxjs';
import { User } from './auth/auth.interface';
import { getUser } from './store/selectors/auth.selectors';
import { delay, filter, tap } from 'rxjs/operators';
import { emersionAnimation } from './animations/emersion.animation';
import { MatDialog } from '@angular/material';
import { EnterNicknameComponent } from './elements/enter-nickname/enter-nickname.component';


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  animations: [emersionAnimation],
})
export class AppComponent {

  user$: Observable<User> = this.store.select(getUser).pipe(
    filter((user: User) => {
      if (!user) this.store.dispatch(new GetUser());
      return !!user;
    }),
    // tap((user: User) => {
    //   if (user.authenticated && !user.displayName) {
    //     const nicknameRef = this.modal.open(EnterNicknameComponent, { disableClose: true });
    //     nicknameRef.afterClosed().subscribe((nickname) => {
    //       // this.store.dispatch(new UpdateCurrentUser({ nickname }));
    //     });
    //   }
    // }),
    // delay(1500),
  );

  constructor(
    private store: Store<AppState>,
    private modal: MatDialog,
  ) {}
}
