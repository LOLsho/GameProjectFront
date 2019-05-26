import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '../../auth/auth.interface';


export interface PlayersState extends EntityState<User> {
  loaded: boolean;
}

export function selectPlayerId(player: User): string {
  return player.uid;
}

export const playersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: selectPlayerId,
});

export const initialPlayersState: PlayersState = playersAdapter.getInitialState({
  loaded: false,
});

