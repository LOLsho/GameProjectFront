import { Component, Input, OnInit } from '@angular/core';
import { UserStatus } from '../../services/presence.service';

@Component({
  selector: 'app-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
})
export class StatusIndicatorComponent implements OnInit {

  @Input() status: UserStatus;

  constructor() { }

  ngOnInit() {
  }

}
