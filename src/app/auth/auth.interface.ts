export interface AuthWithEmailAndPasswordData {
  email: string;
  password: string;
}

export interface User {
  authenticated?: boolean;
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  status: 'online' | 'away' | 'offline';
}

export const defaultUser: any = {
  authenticated: false,
  name: 'GUEST',
};
