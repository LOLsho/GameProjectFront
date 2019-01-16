import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <app-header></app-header>
    <div class="main">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {

  constructor() {
  }
}
