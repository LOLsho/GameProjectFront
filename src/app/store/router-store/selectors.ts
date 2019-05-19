import { RouterState } from './state';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';


const getUrl = (state: RouterReducerState<RouterState>): string => {
  if (state.state) return state.state.url;
};
const getQueryParams = (state: RouterReducerState<RouterState>): Params => state.state.queryParams;
const getParams = (state: RouterReducerState<RouterState>): Params => state.state.params;

export const selectRouterState: MemoizedSelector<object, RouterReducerState<RouterState>>
  = createFeatureSelector<RouterReducerState<RouterState>>('routerReducer');

export const selectRouterUrl: MemoizedSelector<object, string>
  = createSelector(selectRouterState, getUrl);

export const selectQueryParams: MemoizedSelector<object, Params>
  = createSelector(selectRouterState, getQueryParams);

export const selectRouterParams: MemoizedSelector<object, Params>
  = createSelector(selectRouterState, getParams);

export const selectGameNameFromParams: MemoizedSelector<object, string>
  = createSelector(selectRouterParams, (params: Params) => params.game);
