import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Language } from 'angular-l10n';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  @Language() lang: string;

  @Input() text: string = 'Hello world';

  constructor(
    private modal: MatDialogRef<ModalInfoComponent>,
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modal.close();
  }
}
