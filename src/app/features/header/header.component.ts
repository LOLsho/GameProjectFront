import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocaleService, Language } from 'angular-l10n';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs/operators';
import { User } from '../../auth/auth.interface';
import { selectAuthUser, selectIsAuthenticated } from '@store/auth-store/selectors';
import { AppState } from '@store/state';
import { Logout } from '@store/auth-store/actions';
import { MatDialog } from '@angular/material';
import { UserProfileComponent } from '../user-profile/user-profile.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Language() lang: string;

  @ViewChild('userMenu') userMenu: ElementRef;

  subs: Subscription[] = [];
  userMenuOpened: boolean;

  authenticatedUser$: Observable<User> = this.store.select(selectIsAuthenticated).pipe(
    switchMap((authenticated: boolean) => {
      if (authenticated) return this.store.select(selectAuthUser);
      else return of(null);
    }),
  );

  constructor(
    private locale: LocaleService,
    private store: Store<AppState>,
    private modal: MatDialog,
  ) {}

  openUserMenu() {
    this.userMenuOpened = true;
    setTimeout(() => this.subscribeToClicks());
  }

  closeUserMenu() {
    this.userMenuOpened = false;
    this.unsubscribe();
  }

  ngOnInit() {}

  subscribeToClicks() {
    this.subs.push(fromEvent(window, 'click').subscribe(() => this.closeUserMenu()));

    this.subs.push(
      fromEvent(this.userMenu.nativeElement, 'click').subscribe((event: any) => event.stopPropagation()),
    );
  }

  singOut() {
    this.userMenuOpened = false;
    this.store.dispatch(new Logout());
  }

  changeLanguage(lang: string) {
    this.locale.setCurrentLanguage(lang);
  }

  goToUserProfile() {
    this.store.select(selectAuthUser).pipe(
      take(1)
    ).subscribe((user: User) => {
      this.modal.open(UserProfileComponent, {
        data: {
          editable: true,
          userId: user.uid,
        }
      });
    });

    this.closeUserMenu();
  }

  unsubscribe() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
