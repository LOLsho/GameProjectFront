import {
  CLEAR_STEPS_STATE, LOAD_STEPS,
  MAKE_STEP,
  STEP_CANCELED,
  STEP_MADE, STEPS_LOADED,
  StepsActions, SUBSCRIBE_TO_STEPS, UNSUBSCRIBE_FROM_STEPS,
} from '../actions/steps.actions';
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

    case STEPS_LOADED:
      return stepsAdapter.addAll(action.payload, { ...state, loaded: true });

    case STEP_MADE:
      return stepsAdapter.addOne(action.payload, { ...state, loaded: true });

    case STEP_CANCELED:
      return stepsAdapter.removeOne(action.payload.id, state);

    case CLEAR_STEPS_STATE:
      return stepsAdapter.removeAll({ ...state, loaded: false });

    case LOAD_STEPS:
    case MAKE_STEP:
    case SUBSCRIBE_TO_STEPS:
    case UNSUBSCRIBE_FROM_STEPS:
      return state;
  }

  return state;
}

