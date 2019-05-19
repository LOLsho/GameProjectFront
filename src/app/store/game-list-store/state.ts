import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GameItem } from '../../game-wrapper/game.interfaces';


export interface GameListState extends EntityState<GameItem> {
  loaded: boolean;
}

export const gameListAdapter: EntityAdapter<GameItem> = createEntityAdapter<GameItem>();

export const initialState: GameListState = gameListAdapter.getInitialState({
  loaded: false,
});
