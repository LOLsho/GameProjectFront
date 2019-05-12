import { EntityState } from '@ngrx/entity';
import { GameItem } from '../../game-wrapper/game.interfaces';


export interface PlayersState extends EntityState<GameItem> {
  playersOnline
}
