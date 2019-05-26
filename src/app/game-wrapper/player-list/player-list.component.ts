import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { selectPlayersAll, selectPlayersLoaded } from '@store/players-store/selectors';
import { SubscribeToPlayers } from '@store/players-store/actions';
import { filter, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {

  @Input() sessionId: string;

  players$ = this.store.select(selectPlayersLoaded).pipe(
    filter((loaded: boolean) => loaded),
    switchMap(() => this.store.select(selectPlayersAll)),
  );

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new SubscribeToPlayers({ sessionId: this.sessionId }));
  }
}
