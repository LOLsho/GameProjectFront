import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { LocaleService, Language } from 'angular-l10n';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Language() lang: string;

  constructor(
    public auth: AuthService,
    public locale: LocaleService,
  ) {
  }

  ngOnInit() {
  }

  singOut() {
    this.auth.logout();
  }

  changeLanguage(lang) {
    this.locale.setCurrentLanguage(lang);
  }
}
