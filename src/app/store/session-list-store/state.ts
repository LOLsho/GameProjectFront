import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Session } from '../../game-wrapper/game.interfaces';


export interface SessionListState extends EntityState<Session> {
  loaded: boolean;
}

export function sortByDate(a: Session, b: Session): number {
  return b.created - a.created;
}

export const sessionListAdapter: EntityAdapter<Session>
  = createEntityAdapter<Session>({
    sortComparer: sortByDate,
  });

export const initialState: SessionListState = sessionListAdapter.getInitialState({
  loaded: false,
});
