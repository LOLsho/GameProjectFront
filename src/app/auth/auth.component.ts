import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
    <section class="auth">
      <div class="auth__container">

        <router-outlet></router-outlet>

      </div>
    </section>
  `
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
