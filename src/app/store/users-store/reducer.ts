import { initialUsersState, usersAdapter, UsersState } from '@store/users-store/state';
import { UsersActions, UsersActionType } from '@store/users-store/actions';


export function usersReducer(state: UsersState = initialUsersState, action: UsersActions): UsersState {
  switch (action.type) {
    case UsersActionType.LoadUser:
    case UsersActionType.UpdateUser:
      return state;

    case UsersActionType.SetLoadedUser:
      return usersAdapter.upsertOne(action.payload, state);
  }

  return state;
}
