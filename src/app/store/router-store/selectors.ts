import { RouterState } from './state';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Params } from '@angular/router';


const getUrl = (state: RouterState) => {
  if (state) return state.url;
};
const getQueryParams = (state: RouterState) => state.queryParams;
const getParams = (state: RouterState) => state.params;

export const selectRouterState: MemoizedSelector<object, RouterState>
  = createFeatureSelector<RouterState>('routerReducer');

export const selectRouterUrl: MemoizedSelector<object, string>
  = createSelector(selectRouterState, getUrl);

export const selectQueryParams: MemoizedSelector<object, Params>
  = createSelector(selectRouterState, getQueryParams);

export const selectRouterParams: MemoizedSelector<object, Params>
  = createSelector(selectRouterState, getParams);

export const selectGameNameFromParams: MemoizedSelector<object, string>
  = createSelector(selectRouterParams, (params: Params) => params.game);
