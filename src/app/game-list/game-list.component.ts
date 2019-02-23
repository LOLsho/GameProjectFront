import { Component, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { Game, GameItem, GameList } from '../game-wrapper/game.interfaces';
import { Store } from '@ngrx/store';
import { GameListState } from '../store/reducers/games-list.reduces';
import { getGameList } from '../store/selectors/game-list.selectors';
import { delay, filter, map, tap } from 'rxjs/operators';
import { LoadGames } from '../store/actions/games-list.actions';
import { Observable } from 'rxjs';
import { GAMES } from './game-list';
import { emersionAnimation } from '../animations/emersion.animation';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  animations: [emersionAnimation],
})
export class GameListComponent implements OnInit {

  @Language() lang: string;

  games$: Observable<any> = this.store.select(getGameList).pipe(
    filter((gamesList: GameList) => {
      if (!gamesList) this.store.dispatch(new LoadGames());
      return !!gamesList;
    }),
    map((gamesList: GameList) => {
      return gamesList.filter((gameItem: GameItem) => {
        const names = GAMES.map((game: Game) => game.name);
        return names.includes(gameItem.name);
      });
    }),
    map((gamesList: GameList) => {
      return gamesList.map((gameItem: GameItem) => {
        const gameFromFront = GAMES.find((game) => game.name === gameItem.name);
        return { ...gameItem, ...gameFromFront };
      });
    }),
    tap(console.log),
    // delay(90000)
  );

  constructor(
    private store: Store<GameListState>,
  ) {}

  ngOnInit() {
  }
}
