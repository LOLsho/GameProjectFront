import { Component, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { GameInitial, GameItem, GameList } from '../../game-wrapper/game.interfaces';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { GAMES } from './game-list';
import { emersionAnimation } from '../../animations/emersion.animation';
import { selectGameList, selectGameListLoaded } from '@store/game-list-store/selectors';
import { LoadGames, UpdateGameItem } from '@store/game-list-store/actions';
import { AppState } from '@store/state';
import { RouterGo } from '@store/router-store/actions';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  animations: [emersionAnimation],
})
export class GameListComponent implements OnInit {

  @Language() lang: string;

  games$: Observable<any> = this.store.select(selectGameListLoaded).pipe(
    switchMap((loaded: boolean) => {
      if (!loaded) {
        this.store.dispatch(new LoadGames());
        return of(null);
      } else return this.store.select(selectGameList).pipe(
        map((gamesList: GameList) => {
          return gamesList.filter((gameItem: GameItem) => {
            const names = GAMES.map((game: GameInitial) => game.name);
            return names.includes(gameItem.name);
          });
        }),
        map((gamesList: GameList) => gamesList.filter((game: GameItem) => !game.blocked))
      );
    }),
  );

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit() {}

  playClicked(game: GameItem) {
    this.store.dispatch(new RouterGo({ path: ['game', `${game.name}`] }));
  }

  blockGame(game: GameItem) {
    this.store.dispatch(new UpdateGameItem({
      id: game.id,
      changes: {
        blocked: true,
      }
    }));
  }
}
