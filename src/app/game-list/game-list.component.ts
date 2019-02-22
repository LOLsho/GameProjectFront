import { Component, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { Game, GameItem, GameList } from '../game-wrapper/game.interfaces';
import { Store } from '@ngrx/store';
import { GameListState } from './store/reducers/games-list.reduces';
import { getGameList } from './store/selectors/game-list.selectors';
import { filter, map } from 'rxjs/operators';
import { LoadGames } from './store/actions/games-list.actions';
import { Observable } from 'rxjs';
import { GAMES } from './game-list';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {

  @Language() lang: string;

  games$: Observable<GameList> = this.store.select(getGameList).pipe(
    filter((gamesList: GameList) => {
      if (!gamesList) this.store.dispatch(new LoadGames());
      return !!gamesList;
    }),
    map((gamesList: GameList) => {
      console.log('gamesList - ', gamesList);
      return gamesList.filter((gameItem: GameItem) => {
        const names = GAMES.map((game: Game) => game.title);
        return names.includes(gameItem.name);
      });
    }),
  );

  constructor(
    private store: Store<GameListState>,
  ) {}

  ngOnInit() {

  }
}
