import { playersAdapter, PlayersState } from '@store/players-store/state';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { User } from '../../auth/auth.interface';


const getLoaded = (state: PlayersState): boolean => state.loaded;

export const selectPlayersState: MemoizedSelector<object, PlayersState>
  = createFeatureSelector<PlayersState>('players');


const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = playersAdapter.getSelectors();


export const selectPlayersLoaded: MemoizedSelector<object, boolean>
  = createSelector(selectPlayersState, getLoaded);

export const selectPlayersAll: MemoizedSelector<object, User[]>
  = createSelector(selectPlayersState, selectAll);
