import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss']
})
export class SocialsComponent implements OnInit {

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
  }

  async authGoogle() {
    await this.auth.loginViaGoogle();

  }
}
