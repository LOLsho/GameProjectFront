import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Language, TranslationService } from 'angular-l10n';
import { Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { User } from '../../auth/auth.interface';
import { filter, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { selectUserById } from '@store/users-store/selectors';
import { LoadUser, UpdateUser } from '@store/users-store/actions';
import { emersionAnimation } from '../../animations/emersion.animation';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [emersionAnimation],
})
export class UserProfileComponent implements OnInit {

  readonly NAME_MIN_LENGTH = 2;
  readonly NAME_MAX_LENGTH = 20;
  readonly EMAIL_MIN_LENGTH = 6;

  @Language() lang: string;

  @Input() userId: string;
  @Input() editable: boolean;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(this.NAME_MIN_LENGTH), Validators.maxLength(this.NAME_MAX_LENGTH)]],
    email: ['', [Validators.required, Validators.minLength(6), Validators.email]],
    color: [''],
  });

  pending = true;
  user: User;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private trn: TranslationService,
    @Inject(MAT_DIALOG_DATA) private data: { userId: string, editable: boolean },
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.pending = true;
    const id = this.data.userId;
    this.store.dispatch(new LoadUser({ id }));
    this.store.select(selectUserById, { id }).pipe(
      filter((user: User) => Boolean(user)),
      take(1),
    ).subscribe((user: User) => {
      this.pending = false;
      this.user = user;
      this.updateForm();
    });
  }

  updateForm() {
    if (this.data.editable) {
      this.form.enable();
    } else {
      this.form.disable();
    }

    this.form.patchValue({
      name: this.user.name,
      email: this.user.email,
      color: this.user.color || 'black',
    });
  }

  saveProfile() {
    this.pending = true;
    this.store.dispatch(new UpdateUser({
      id: this.user.uid,
      data: this.form.value,
    }));
  }

  get emailErrorMessage() {
    const email = this.form.get('email');
    return email.hasError('required') ? this.trn.translate('SIGN-IN__EMAIL-REQUIRED') :
      email.hasError('email') ? this.trn.translate('SIGN-IN__EMAIL-NOT-VALID') :
        email.hasError('minlength') ? this.trn.translate('Min-length') + ' - ' + this.EMAIL_MIN_LENGTH : '';
  }
}
