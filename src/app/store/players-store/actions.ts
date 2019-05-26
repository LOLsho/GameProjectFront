import { Action } from '@ngrx/store';
import { User } from '../../auth/auth.interface';


export enum PlayersActionType {
  SubscribeToPlayers = '[PLAYERS COMPONENT] Subscribe To Players',
  UnsubscribeFromPlayers = '[SESSION ENDED] Unsubscribe From Players',

  AddPlayer = '[FIRESTORE API] Add Player',
  UpdatePlayer = '[FIRESTORE API] Update Player',
  RemovePlayer = '[FIRESTORE API] Remove Player',

  ClearPlayersState = '[Session Exit] Clear Players State',
  PlayersError = '[FIRESTORE API] Players Error',
}


export class SubscribeToPlayers implements Action {
  readonly type = PlayersActionType.SubscribeToPlayers;
  constructor(public payload: { sessionId: string }) {}
}

export class UnsubscribeFromPlayers implements Action {
  readonly type = PlayersActionType.UnsubscribeFromPlayers;
}

export class AddPlayer implements Action {
  readonly type = PlayersActionType.AddPlayer;
  constructor(public payload: User) {}
}

export class UpdatePlayer implements Action {
  readonly type = PlayersActionType.UpdatePlayer;
  constructor(public payload: User) {}
}

export class RemovePlayer implements Action {
  readonly type = PlayersActionType.RemovePlayer;
  constructor(public payload: User) {}
}

export class ClearPlayersState implements Action {
  readonly type = PlayersActionType.ClearPlayersState;
}

export class PlayersError implements Action {
  readonly type = PlayersActionType.PlayersError;
  constructor(public payload: any) {}
}


export type PlayersAction =
  | SubscribeToPlayers
  | UnsubscribeFromPlayers
  | AddPlayer
  | UpdatePlayer
  | RemovePlayer
  | ClearPlayersState
  | PlayersError;
