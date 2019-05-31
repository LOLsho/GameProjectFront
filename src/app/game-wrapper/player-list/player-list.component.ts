import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { selectPlayersAll, selectPlayersLoaded } from '@store/players-store/selectors';
import { KickOutPlayer, SubscribeToPlayers } from '@store/players-store/actions';
import { filter, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { selectAuthUser } from '@store/auth-store/selectors';
import { Observable } from 'rxjs';
import { User } from '../../auth/auth.interface';
import { selectIsSessionOver } from '@store/session-store/selectors';
import { Session } from '../game.interfaces';


@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {

  @Input() session: Session;
  @Input() user: User;

  sessionOver$: Observable<boolean> = this.store.select(selectIsSessionOver).pipe(
    filter((isOver: boolean) => isOver),
  );

  players$: Observable<User[]> = this.store.select(selectPlayersLoaded).pipe(
    filter((loaded: boolean) => loaded),
    switchMap(() => this.store.select(selectPlayersAll).pipe(
      takeUntil(this.sessionOver$),
      filter((players) => players.length > 0),
      withLatestFrom(this.store.select(selectAuthUser)),
      map(([players, me]: [User[], User]) => {
        const myIndex = players.findIndex((player: User) => player.uid === me.uid);
        me = players.splice(myIndex, 1)[0];
        players.unshift(me);
        return players;
      }),
    )),
  );

  kickOutPlayer(player: User) {
    this.store.dispatch(new KickOutPlayer(player));
  }

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new SubscribeToPlayers({ sessionId: this.session.id }));
  }
}
