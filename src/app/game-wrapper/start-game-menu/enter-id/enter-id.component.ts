import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Language, TranslationService } from 'angular-l10n';
import { FirestoreService } from '../../../services/firestore.service';
import { emersionAnimation } from '../../../animations/emersion.animation';
import { NotifierService } from 'angular-notifier';
import { Session } from '../../game.interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/reducers';


@Component({
  selector: 'app-enter-id',
  templateUrl: './enter-id.component.html',
  styleUrls: ['./enter-id.component.scss'],
  animations: [emersionAnimation],
})
export class EnterIdComponent implements OnInit {

  @Language() lang: string;

  @Output() sessionFound = new EventEmitter<Session>();

  idForm = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]]
  });

  pending: boolean;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private notifier: NotifierService,
    private translation: TranslationService,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.pending = true;
    this.firestoreService.getSessionById(this.idForm.controls.id.value).subscribe((doc) => {
      this.pending = false;
      if (doc.exists) {
        const session: Session = { id: doc.id, ...doc.data() };
        this.handleReceivedSession(session);
      } else {
        this.notifier.notify('error', this.translation.translate('ENTER-ID_NO-SUCH-GAME'));
      }
    });
  }

  handleReceivedSession(session: Session) {
    if (session.isSessionOver) {
      this.notifier.notify('warning', this.translation.translate('ENTER-ID_GAME-FINISHED'));
    } else if (session.gameMode === 'single') {
      this.notifier.notify('warning', this.translation.translate('ENTER-ID_GAME-INCORRECT-ID'));
    } else  {

      this.sessionFound.emit(session);

    }
  }
}
