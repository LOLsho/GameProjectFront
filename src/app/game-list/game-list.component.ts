import { Component, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { GameInitial, GameItem, GameList } from '../game-wrapper/game.interfaces';
import { Store } from '@ngrx/store';
import { GameListState } from '../store/reducers/games-list.reduces';
import { selectGameList, selectGameListLoaded } from '../store/selectors/game-list.selectors';
import { map, switchMap, tap } from 'rxjs/operators';
import { LoadGames, UpdateGameItem } from '../store/actions/games-list.actions';
import { Observable, of } from 'rxjs';
import { GAMES } from './game-list';
import { emersionAnimation } from '../animations/emersion.animation';
import { RouterGo } from '../store/actions/router.actions';


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
    private store: Store<GameListState>,
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
