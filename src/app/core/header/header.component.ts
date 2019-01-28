import { Component, OnInit } from '@angular/core';
import { LocaleService, Language } from 'angular-l10n';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/reducers/auth.reducer';
import { Logout } from '../../store/actions/auth.actions';
import { getUser } from '../../store/selectors/auth.selectors';
import { map } from 'rxjs/operators';
import { User } from '../../auth/auth.interface';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Language() lang: string;
  authenticated$: Observable<boolean>;

  constructor(
    public locale: LocaleService,
    private store: Store<AuthState>,
  ) {}

  ngOnInit() {
    this.authenticated$ = this.store.select(getUser).pipe(
      map((user: User) => user.authenticated)
    );
  }

  singOut() {
    this.store.dispatch(new Logout());
  }

  changeLanguage(lang) {
    this.locale.setCurrentLanguage(lang);
  }
}
