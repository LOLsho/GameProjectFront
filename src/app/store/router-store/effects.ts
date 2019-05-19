import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as routerActions from './actions';
import { map, tap } from 'rxjs/operators';


@Injectable()
export class RouterEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(routerActions.ActionTypes.RouterGo),
    map((action: routerActions.RouterGo) => action.payload),
    tap(({ path, queryParams, extras }) => this.router.navigate(path, { queryParams, ...extras })),
  );
}

