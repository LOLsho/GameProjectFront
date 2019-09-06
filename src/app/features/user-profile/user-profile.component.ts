import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Language } from 'angular-l10n';
import { Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { Observable } from 'rxjs';
import { User } from '../../auth/auth.interface';
import { selectAuthUser } from '@store/auth-store/selectors';
import { take } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  @Language() lang: string;

  @Input() userId: string;
  @Input() editable: boolean;

  form: FormGroup = this.fb.group({
    name: [],
    email: [],
    color: [],
  });

  user$: Observable<User>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    // this.store.dispatch()
  }

  onNameChange(name) {
    console.log('name:', name);
  }
}
