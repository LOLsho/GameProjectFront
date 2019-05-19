import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Step } from '../../game-wrapper/game.interfaces';


export interface StepsState extends EntityState<Step> {
  loaded: boolean;
}

export function sortByDate(a: Step, b: Step): number {
  return a.timestamp - b.timestamp;
}

export const stepsAdapter: EntityAdapter<Step>
  = createEntityAdapter<Step>({
    sortComparer: sortByDate,
  });

export const initialState: StepsState = stepsAdapter.getInitialState({
  loaded: false,
});
