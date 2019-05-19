import { ActionTypes, Actions } from './actions';
import { StepsState, initialState, stepsAdapter } from './state';


export function stepsReducer(state: StepsState = initialState, action: Actions): StepsState {
  switch (action.type) {

    case ActionTypes.StepsLoaded:
      return stepsAdapter.addAll(action.payload, { ...state, loaded: true });

    case ActionTypes.StepMade:
      return stepsAdapter.addOne(action.payload, { ...state, loaded: true });

    case ActionTypes.StepCanceled:
      return stepsAdapter.removeOne(action.payload.id, state);

    case ActionTypes.ClearStepsState:
      return stepsAdapter.removeAll({ ...state, loaded: false });

    case ActionTypes.LoadSteps:
    case ActionTypes.MakeStep:
    case ActionTypes.SubscribeToSteps:
    case ActionTypes.UnsubscribeFromSteps:
      return state;
  }

  return state;
}
