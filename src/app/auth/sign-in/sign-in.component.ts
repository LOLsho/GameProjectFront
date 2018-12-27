import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Language, TranslationService} from 'angular-l10n';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  @Language() lang: string;

  EMAIL_MIN_LENGTH = 6;
  PASSWORD_MIN_LENGTH = 6;

  hide = true;
  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private trn: TranslationService,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(this.EMAIL_MIN_LENGTH)]),
      password: new FormControl('', [Validators.required, Validators.minLength(this.PASSWORD_MIN_LENGTH)])
    });

    this.email = this.form.get('email');
    this.password = this.form.get('password');
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? this.trn.translate('SIGN-IN__EMAIL-REQUIRED') :
      this.email.hasError('minlength') ? this.trn.translate('Min-length') + ' - ' + this.EMAIL_MIN_LENGTH :
        this.email.hasError('email') ? this.trn.translate('SIGN-IN__EMAIL-NOT-VALID') : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? this.trn.translate('SIGN-IN__PASSWORD-REQUIRED') :
      this.password.hasError('minlength') ? this.trn.translate('Min-length') + ' - ' + this.PASSWORD_MIN_LENGTH : '';
  }

  onSubmit() {
    if (this.form.invalid) return;

    const userDataToSend = {
      email: this.email.value,
      password: this.password.value
    };

    this.authService.signIn(userDataToSend).subscribe(
      (response) => {
        this.router.navigate(['/games']);
        console.log('response - ', response);
      }, error => console.log(error)
    );
  }

}
