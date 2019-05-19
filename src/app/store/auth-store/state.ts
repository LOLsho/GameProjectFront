import { User } from '../../auth/auth.interface';


export interface AuthState {
  user: User;
  pending: boolean;
}

export const initialState: AuthState = {
  user: null,
  pending: false,
};
