import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { usersAdapter, UsersState } from '@store/users-store/state';
import { User } from '../../auth/auth.interface';
import { Dictionary } from '@ngrx/entity';


export const selectUsersState: MemoizedSelector<object, UsersState>
  = createFeatureSelector<UsersState>('users');

export const getUserById = (users, props: { id: string }): User => users[props.id];

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = usersAdapter.getSelectors();

export const selectUserEntities: MemoizedSelector<UsersState, Dictionary<User>>
  = createSelector(selectUsersState, selectEntities);


export const selectUserById: any = createSelector(selectUserEntities, getUserById);
