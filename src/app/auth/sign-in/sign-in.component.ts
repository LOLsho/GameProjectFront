import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)])
    });

    this.email = this.form.get('email');
    this.password = this.form.get('password');
  }

  hide = true;
  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('minlength') ? 'Min length - 6' :
      this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value' :
      this.password.hasError('minlength') ? 'Min length - 6' : '';
  }

  onSubmit() {
    if (this.form.invalid) return;

    let userDataToSend = {
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
