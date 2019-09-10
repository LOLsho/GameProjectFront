import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '../../auth/auth.interface';
import { selectPlayerId } from '@store/players-store/state';


export interface UsersState extends EntityState<User> {}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: selectPlayerId,
});

export const initialUsersState: UsersState = usersAdapter.getInitialState();
