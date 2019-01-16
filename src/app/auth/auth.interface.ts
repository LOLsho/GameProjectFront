export interface AuthWithEmailAndPasswordData {
  email: string;
  password: string;
}

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}
