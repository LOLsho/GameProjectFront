import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/reducers/auth.reducer';
import { FacebookLogin, GithubLogin, GoogleLogin } from '../../store/actions/auth.actions';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss']
})
export class SocialsComponent implements OnInit {

  constructor(
    private store: Store<AuthState>
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
