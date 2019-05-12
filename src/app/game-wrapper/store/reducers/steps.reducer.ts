import { StepsActions, StepsActionTypes } from '../actions/steps.actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Step } from '../../game.interfaces';


export interface StepsState extends EntityState<Step> {
  loaded: boolean;
}

export function sortByDate(a: Step, b: Step): number {
  return a.timestamp - b.timestamp;
}

export const stepsAdapter = createEntityAdapter<Step>({
  sortComparer: sortByDate,
});

export const initialStepsState: StepsState = stepsAdapter.getInitialState({
  loaded: false,
});


export function stepsReducer(
  state: StepsState = initialStepsState,
  action: StepsActions,
): StepsState {
  switch (action.type) {

    case StepsActionTypes.StepsLoaded:
      return stepsAdapter.addAll(action.payload, { ...state, loaded: true });

    case StepsActionTypes.StepMade:
      return stepsAdapter.addOne(action.payload, { ...state, loaded: true });

    case StepsActionTypes.StepCanceled:
      return stepsAdapter.removeOne(action.payload.id, state);

    case StepsActionTypes.ClearStepsState:
      return stepsAdapter.removeAll({ ...state, loaded: false });

    case StepsActionTypes.LoadSteps:
    case StepsActionTypes.MakeStep:
    case StepsActionTypes.SubscribeToSteps:
    case StepsActionTypes.UnsubscribeFromSteps:
      return state;
  }

  return state;
}

