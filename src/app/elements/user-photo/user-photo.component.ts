import { Component, Input, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';


@Component({
  selector: 'app-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss'],
})
export class UserPhotoComponent implements OnInit {

  @Language() lang: string;

  @Input() photoUrl: string;
  @Input() name: string;
  @Input() size = 50;
  @Input() shape: 'round' | 'square' = 'square';
  @Input() description: string;
  @Input() bottomLine: string;

  constructor() {}

  ngOnInit() {}
}
