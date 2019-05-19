import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Step } from '../../game-wrapper/game.interfaces';
import { StepsState, stepsAdapter } from './state';


const getLoaded = (state: StepsState): boolean => state.loaded;


export const selectStepsState: MemoizedSelector<object, StepsState>
  = createFeatureSelector<StepsState>('steps');


const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = stepsAdapter.getSelectors();


export const selectStepsLoaded: MemoizedSelector<object, boolean>
  = createSelector(selectStepsState, getLoaded);

export const selectStepsAll: MemoizedSelector<object, Step[]>
  = createSelector(selectStepsState, selectAll);

export const selectLastStep: MemoizedSelector<object, Step>
  = createSelector(selectStepsAll, (steps: Step[]): Step => steps[steps.length - 1]);
