import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Language, TranslationService} from 'angular-l10n';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  @Language() lang: string;

  EMAIL_MIN_LENGTH = 6;
  PASSWORD_MIN_LENGTH = 6;

  form: FormGroup;
  hide = true;
  email: AbstractControl;
  password: AbstractControl;
  passwordRepeat: AbstractControl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private trn: TranslationService,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordRepeat: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.email = this.form.get('email');
    this.password = this.form.get('password');
    this.passwordRepeat = this.form.get('passwordRepeat');
  }

  get isPasswordsMatch(): boolean {
    return this.password.value === this.passwordRepeat.value;
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? this.trn.translate('SIGN-IN__EMAIL-REQUIRED') :
      this.email.hasError('email') ? this.trn.translate('SIGN-IN__EMAIL-NOT-VALID') :
        this.email.hasError('minlength') ? this.trn.translate('Min-length') + ' - ' + this.EMAIL_MIN_LENGTH : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? this.trn.translate('SIGN-IN__PASSWORD-REQUIRED') :
      this.password.hasError('minlength') ? this.trn.translate('Min-length') + ' - ' + this.PASSWORD_MIN_LENGTH : '';
  }

  getPasswordRepeatErrorMessage() {
    return this.passwordRepeat.hasError('required') ? this.trn.translate('SIGN-UP__PASSWORD-AGAIN-REQUIRED') :
      this.passwordRepeat.hasError('minlength') ? this.trn.translate('Min-length') + ' - ' + this.PASSWORD_MIN_LENGTH : '';
  }

  async submit() {
    if (this.form.invalid && !this.isPasswordsMatch) return;

    const userDataToSend = {
      email: this.email.value,
      password: this.password.value
    };

    await this.authService.registerViaEmailAndPassword(userDataToSend);
    this.router.navigate(['/games']);
  }
}
