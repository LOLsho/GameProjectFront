import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Language} from 'angular-l10n';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  @Language() lang: string;

  form: FormGroup;
  hide = true;
  email: AbstractControl;
  password: AbstractControl;
  passwordRepeat: AbstractControl;

  constructor(
    private authService: AuthService,
    private router: Router
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
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        this.email.hasError('minlength') ? 'Min email length - 6' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value' :
      this.password.hasError('minlength') ? 'Min password length - 6' : '';
  }

  getPasswordRepeatErrorMessage() {
    return this.passwordRepeat.hasError('required') ? 'You must enter a value' :
      this.passwordRepeat.hasError('minlength') ? 'Min password length - 6' : '';
  }

  onSubmit() {
    // console.log('from localstorage - ', localStorage.getItem('token'));
    //
    // return;

    if (this.form.invalid && !this.isPasswordsMatch) return;

    const userDataToSend = {
      email: this.email.value,
      password: this.password.value
    };

    this.authService.signUp(userDataToSend).subscribe(
      response => {
        this.router.navigate(['/games']);
        console.log('response - ', response);
      },
      error => console.log(error.error.message)
    );
  }

}
