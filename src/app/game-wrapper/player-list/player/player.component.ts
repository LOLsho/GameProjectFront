import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../auth/auth.interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() player: User;

  constructor() { }

  ngOnInit() {
  }

}
