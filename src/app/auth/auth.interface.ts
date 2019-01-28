export interface AuthWithEmailAndPasswordData {
  email: string;
  password: string;
}

export interface User {
  authenticated: boolean;
  uid?: string;
  email?: string;
  name?: string;
  photoURL?: string;
  displayName?: string;
}

export const defaultUser: User = {
  authenticated: false,
  name: 'GUEST',
};
