import { Action } from '@ngrx/store';
import { NewStep, Step } from '../../game.interfaces';


export const SUBSCRIBE_TO_STEPS = '[GAME] Subscribe To Steps';
export const UNSUBSCRIBE_FROM_STEPS = '[GAME] Unsubscribe From Steps';

export const LOAD_STEPS = '[GAME] Load Steps';
export const STEPS_LOADED = '[FIRESTORE API] Steps Loaded';
export const STEP_MADE = '[FIRESTORE API] Somebody Made Step';
export const STEP_CANCELED = '[FIRESTORE API] Somebody Canceled Step';

export const MAKE_STEP = '[GAME] Make New Step';

export const CLEAR_STEPS_STATE = '[SESSION EXIT] Clear Steps State';



export class SubscribeToSteps implements Action {
  readonly type = SUBSCRIBE_TO_STEPS;
  constructor(public payload: { sessionId: string }) {}
}

export class UnsubscribeFromSteps implements Action {
  readonly type = UNSUBSCRIBE_FROM_STEPS;
}

export class StepMade implements Action {
  readonly type = STEP_MADE;
  constructor(public payload: Step) {}
}

export class StepCanceled implements Action {
  readonly type = STEP_CANCELED;
  constructor(public payload: Step) {}
}

export class MakeStep implements Action {
  readonly type = MAKE_STEP;
  constructor(public payload: { step: NewStep, sessionId: string }) {}
}

export class StepsLoaded implements Action {
  readonly type = STEPS_LOADED;
  constructor(public payload: Step[]) {}
}

export class LoadSteps implements Action {
  readonly type = LOAD_STEPS;
  constructor(public payload: { sessionId: string }) {}
}

export class ClearStepsState implements Action {
  readonly type = CLEAR_STEPS_STATE;
}


export type StepsActions =
  | SubscribeToSteps
  | UnsubscribeFromSteps
  | LoadSteps
  | StepsLoaded
  | StepMade
  | StepCanceled
  | ClearStepsState
  | MakeStep;
