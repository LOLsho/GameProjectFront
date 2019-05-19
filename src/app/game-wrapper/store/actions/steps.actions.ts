// import { Action } from '@ngrx/store';
// import { Step } from '../../game.interfaces';
//
//
// export enum StepsActionTypes {
//   SubscribeToSteps = '[GAME] Subscribe To Steps',
//   UnsubscribeFromSteps = '[GAME] Unsubscribe From Steps',
//
//   LoadSteps = '[GAME] Load Steps',
//   StepsLoaded = '[FIRESTORE API] Steps Loaded',
//   StepMade = '[FIRESTORE API] Somebody Made Step',
//   StepCanceled = '[FIRESTORE API] Somebody Canceled Step',
//
//   MakeStep = '[GAME] Make New Step',
//
//   ClearStepsState = '[SESSION EXIT] Clear Steps State',
//
//   StepsFail = '[FIRESTORE API] Steps Failed',
// }
//
//
// export class SubscribeToSteps implements Action {
//   readonly type = StepsActionTypes.SubscribeToSteps;
//   constructor(public payload: { sessionId: string }) {}
// }
//
// export class UnsubscribeFromSteps implements Action {
//   readonly type = StepsActionTypes.UnsubscribeFromSteps;
// }
//
// export class StepMade implements Action {
//   readonly type = StepsActionTypes.StepMade;
//   constructor(public payload: Step) {}
// }
//
// export class StepCanceled implements Action {
//   readonly type = StepsActionTypes.StepCanceled;
//   constructor(public payload: Step) {}
// }
//
// export class MakeStep implements Action {
//   readonly type = StepsActionTypes.MakeStep;
//   constructor(public payload: { step: Step, sessionId: string }) {}
// }
//
// export class StepsLoaded implements Action {
//   readonly type = StepsActionTypes.StepsLoaded;
//   constructor(public payload: Step[]) {}
// }
//
// export class LoadSteps implements Action {
//   readonly type = StepsActionTypes.LoadSteps;
//   constructor(public payload: { sessionId: string }) {}
// }
//
// export class ClearStepsState implements Action {
//   readonly type = StepsActionTypes.ClearStepsState;
// }
//
// export class StepsFail implements Action {
//   readonly type = StepsActionTypes.StepsFail;
//   constructor(public payload: any) {}
// }
//
//
// export type StepsActions =
//   | SubscribeToSteps
//   | UnsubscribeFromSteps
//   | LoadSteps
//   | StepsLoaded
//   | StepMade
//   | StepCanceled
//   | ClearStepsState
//   | StepsFail
//   | MakeStep;
