import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrls: ['./input-area.component.scss'],
})
export class InputAreaComponent implements OnInit {

  chatForm: FormGroup = this.fb.group({
    textInput: [''],
  });

  @Output() send = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  onSend(text) {
    if (!text || text.trim().length === 0) return;
    this.send.emit(text);
    this.chatForm.reset();
  }
}
