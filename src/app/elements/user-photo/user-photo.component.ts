import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss'],
})
export class UserPhotoComponent implements OnInit {

  @Input() photoUrl: string;
  @Input() name: string;
  @Input() size = 50;

  constructor() {}

  ngOnInit() {}
}
