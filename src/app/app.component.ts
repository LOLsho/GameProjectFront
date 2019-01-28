import { Component } from '@angular/core';
import { GetUser } from './store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers';
import { Observable } from 'rxjs';
import { User } from './auth/auth.interface';
import { getUser } from './store/selectors/auth.selectors';
import { delay, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('appPreloader', [
      // state('displayed', style({
      //   opacity: 1
      // })),
      // state('hidden', style({
      //   opacity: 0
      // })),
      transition(':leave', [
        animate('0.25s', style({ opacity: 0 }))
      ]),
    ])
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {

  user$: Observable<User>;

  constructor(
    private store: Store<AppState>
  ) {
    this.prepareAndLoadApp();
  }

  prepareAndLoadApp() {
    this.store.dispatch(new GetUser());
    this.user$ = this.store.select(getUser).pipe(
      delay(1500),
    );
  }
}
