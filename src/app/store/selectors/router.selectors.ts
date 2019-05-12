import { createFeatureSelector, createSelector } from '@ngrx/store';


export const selectRouterState = createFeatureSelector('routerReducer');

export const selectCurrentUrl = createSelector(selectRouterState, (state: any) => state.state.url);

export const selectParams = createSelector(
  selectRouterState,
  (state: any) => state.state.params
);

export const selectGameNameFromParams = createSelector(
  selectParams,
  (params) => params.game
);

