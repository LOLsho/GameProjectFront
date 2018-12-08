import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { LocaleService, TranslationService, Language } from 'angular-l10n';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Language() lang: string;

  constructor(
    private authService: AuthService,
    public locale: LocaleService,
    public translation: TranslationService,
  ) { }

  isLoggedIn;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  singOut() {
    this.authService.logout();
  }

  changeLanguage() {
    if (this.lang === 'ru') {
      this.locale.setCurrentLanguage('en');
    } else {
      this.locale.setCurrentLanguage('ru');
    }
  }
}
