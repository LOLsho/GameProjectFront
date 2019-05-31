import { Action } from '@ngrx/store';
import { User } from '../../auth/auth.interface';


export enum PlayersActionType {
  SubscribeToPlayers = '[PLAYERS COMPONENT] Subscribe To Players',
  UnsubscribeFromPlayers = '[SESSION ENDED] Unsubscribe From Players',

  PlayersLoaded = '[FIREBASE API] Players Loaded',

  AddPlayer = '[FIREBASE API] Add Player',
  UpdatePlayer = '[FIREBASE API] Update Player',
  RemovePlayer = '[FIREBASE API] Remove Player',

  KickOutPlayer = '[PLAYER LIST] Kick Out Player',
  PlayerKickedOut = '[FIREBASE API] Player Was Kicked Out',

  ClearPlayersState = '[Session Exit] Clear Players State',
  PlayersError = '[FIREBASE API] Players Error',
}


export class SubscribeToPlayers implements Action {
  readonly type = PlayersActionType.SubscribeToPlayers;
  constructor(public payload: { sessionId: string }) {}
}

export class UnsubscribeFromPlayers implements Action {
  readonly type = PlayersActionType.UnsubscribeFromPlayers;
}

export class PlayersLoaded implements Action {
  readonly type = PlayersActionType.PlayersLoaded;
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

export class KickOutPlayer implements Action {
  readonly type = PlayersActionType.KickOutPlayer;
  constructor(public payload: User) {}
}

export class PlayerKickedOut implements Action {
  readonly type = PlayersActionType.PlayerKickedOut;
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
  | PlayersLoaded
  | AddPlayer
  | UpdatePlayer
  | RemovePlayer
  | KickOutPlayer
  | PlayerKickedOut
  | ClearPlayersState
  | PlayersError;
