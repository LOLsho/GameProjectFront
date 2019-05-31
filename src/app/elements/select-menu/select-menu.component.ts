import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectMenuItem } from './select-menu.config';

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
})
export class SelectMenuComponent implements OnInit {

  @Input() items: SelectMenuItem[] = [{ innerHtml: 'Hello', value: 'value' }];

  @Output() itemClicked = new EventEmitter<SelectMenuItem>();

  constructor() { }

  ngOnInit() {
  }

  onItemClicked(item: SelectMenuItem) {
    this.itemClicked.emit(item);
  }
}
