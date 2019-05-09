import { Component, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-enter-nickname',
  templateUrl: './enter-nickname.component.html',
  styleUrls: ['./enter-nickname.component.scss']
})
export class EnterNicknameComponent implements OnInit {

  @Language() lang: string;

  nicknameForm = this.fb.group({
    nickname: ['', [Validators.minLength(4), Validators.maxLength(22), Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private modal: MatDialogRef<EnterNicknameComponent>,
  ) { }

  ngOnInit() {
  }

  submitNickname() {
    this.modal.close(this.nicknameForm.get('nickname').value);
  }
}
