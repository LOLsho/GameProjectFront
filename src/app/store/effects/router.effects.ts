import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { RouterActionTypes, RouterGo } from '../actions/router.actions';
import { map, tap } from 'rxjs/operators';


@Injectable()
export class RouterEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(RouterActionTypes.RouterGo),
    map((action: RouterGo) => action.payload),
    tap(({ path, queryParams, extras }) => this.router.navigate(path, { queryParams, ...extras }))
  );
}

