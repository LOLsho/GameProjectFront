import { Component, OnInit } from '@angular/core';
import { LocaleService, Language } from 'angular-l10n';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { User } from '../../auth/auth.interface';
import { selectAuthUser } from '@store/auth-store/selectors';
import { AppState } from '@store/state';
import { Logout } from '@store/auth-store/actions';


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
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.authenticated$ = this.store.select(selectAuthUser).pipe(
      map((user: User) => user.authenticated),
    );
  }

  singOut() {
    this.store.dispatch(new Logout());
  }

  changeLanguage(lang: string) {
    this.locale.setCurrentLanguage(lang);
  }
}
