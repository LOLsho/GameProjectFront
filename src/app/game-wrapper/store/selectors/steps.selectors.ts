// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { stepsAdapter, StepsState } from '../reducers/steps.reducer';
// import { Step } from '../../game.interfaces';
//
//
// export const selectStepsState = createFeatureSelector<StepsState>('steps');
//
// const {
//   selectIds,
//   selectEntities,
//   selectAll,
//   selectTotal,
// } = stepsAdapter.getSelectors();
//
//
// export const selectStepsLoaded = createSelector(selectStepsState, (state: StepsState) => state.loaded);
//
// export const selectAllSteps = createSelector(selectStepsState, selectAll);
// export const selectLastStep = createSelector(selectAllSteps, (steps: Step[]) => steps[steps.length - 1]);
