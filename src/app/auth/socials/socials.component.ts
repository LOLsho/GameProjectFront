import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { FacebookLogin, GithubLogin, GoogleLogin } from '@store/auth-store/actions';


@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss'],
})
export class SocialsComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit() {}

  authGoogle() {
    this.store.dispatch(new GoogleLogin());
  }

  authFacebook() {
    this.store.dispatch(new FacebookLogin());
  }

  authGithub() {
    this.store.dispatch(new GithubLogin());
  }
}
