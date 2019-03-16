import { Component, Input, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Language() lang: string;

  @Input() boxTitle: string;
  @Input() centered: boolean;

  constructor() { }

  ngOnInit() {
  }

}
