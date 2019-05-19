import { Action } from '@ngrx/store';
import { Step } from '../../game-wrapper/game.interfaces';


export enum ActionTypes {
  SubscribeToSteps = '[GAME] Subscribe To Steps',
  UnsubscribeFromSteps = '[GAME] Unsubscribe From Steps',

  LoadSteps = '[GAME] Load Steps',
  StepsLoaded = '[FIRESTORE API] Steps Loaded',
  StepMade = '[FIRESTORE API] Somebody Made Step',
  StepCanceled = '[FIRESTORE API] Somebody Canceled Step',

  MakeStep = '[GAME] Make New Step',

  ClearStepsState = '[SESSION EXIT] Clear Steps State',

  StepsFail = '[FIRESTORE API] Steps Failed',
}


export class SubscribeToSteps implements Action {
  readonly type = ActionTypes.SubscribeToSteps;
  constructor(public payload: { sessionId: string }) {}
}

export class UnsubscribeFromSteps implements Action {
  readonly type = ActionTypes.UnsubscribeFromSteps;
}

export class StepMade implements Action {
  readonly type = ActionTypes.StepMade;
  constructor(public payload: Step) {}
}

export class StepCanceled implements Action {
  readonly type = ActionTypes.StepCanceled;
  constructor(public payload: Step) {}
}

export class MakeStep implements Action {
  readonly type = ActionTypes.MakeStep;
  constructor(public payload: { step: Step, sessionId: string }) {}
}

export class StepsLoaded implements Action {
  readonly type = ActionTypes.StepsLoaded;
  constructor(public payload: Step[]) {}
}

export class LoadSteps implements Action {
  readonly type = ActionTypes.LoadSteps;
  constructor(public payload: { sessionId: string }) {}
}

export class ClearStepsState implements Action {
  readonly type = ActionTypes.ClearStepsState;
}

export class StepsFail implements Action {
  readonly type = ActionTypes.StepsFail;
  constructor(public payload: any) {}
}


export type Actions =
  | SubscribeToSteps
  | UnsubscribeFromSteps
  | LoadSteps
  | StepsLoaded
  | StepMade
  | StepCanceled
  | ClearStepsState
  | StepsFail
  | MakeStep;
