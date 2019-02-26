import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Language } from 'angular-l10n';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Language() lang: string;

  @Input() title: string;
  @Input() options: MenuOption[];

  @Output() optionSelected = new EventEmitter<MenuOption>();

  constructor() { }

  ngOnInit() {}

  chooseOption(option: MenuOption) {
    this.optionSelected.emit(option);
  }
}



export interface MenuOption {
  capture: string;
  value: any;
  disabled?: boolean;
}
