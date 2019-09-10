import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadUser, SetLoadedUser, UpdateUser, UsersActionType } from '@store/users-store/actions';
import { map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';
import { User } from '../../auth/auth.interface';
import { Observable } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { selectAuthUserId } from '@store/auth-store/selectors';
import { ReloadAuthUser } from '@store/auth-store/actions';
import { NotifierService } from 'angular-notifier';
import { TranslationService } from 'angular-l10n';
import { MatDialog } from '@angular/material/dialog';


@Injectable()
export class UsersEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
    private translation: TranslationService,
    private modal: MatDialog,
  ) {}

  @Effect()
  loadUser$: Observable<Action> = this.actions$.pipe(
    ofType(UsersActionType.LoadUser),
    map((action: LoadUser) => action.payload.id),
    switchMap((id: string) => this.firestoreService.getUser(id).pipe(
      map((user: User) => new SetLoadedUser(user)),
    )),
  );

  @Effect()
  updateUser$: Observable<Action> = this.actions$.pipe(
    ofType(UsersActionType.UpdateUser),
    map((action: UpdateUser) => action.payload),
    switchMap(({ id, data }) => this.firestoreService.updateUser(id, data).pipe(
      tap(() => {
        this.notifierService.notify('success', this.translation.translate('Profile data successfully updated'));
        this.modal.closeAll();
      }),
      withLatestFrom(this.store$.select(selectAuthUserId)),
      mergeMap(([_, myId]) => {
        const dispatchActions: any[] = [new LoadUser({ id })];
        if (myId === id) {
          dispatchActions.push(new ReloadAuthUser());
        }
        return dispatchActions;
      }),
    )),
  );
}
