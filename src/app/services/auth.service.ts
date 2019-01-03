import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLoggedIn$ = new BehaviorSubject<boolean>(!!this.token);

  constructor(
    private http: HttpClient,
  ) {
  }

  private backendPort = 3333;
  private baseUrl = `http://localhost:${this.backendPort}/api`;

  setToken(token) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  signUp(userData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/sign-up`, userData).pipe(
      tap((response) => {
        this.isLoggedIn$.next(true);
        this.setToken(response.token);
      }),
    );
  }

  signIn(userData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/sign-in`, userData).pipe(
      tap((response) => {
        this.isLoggedIn$.next(true);
        this.setToken(response.token);
      }),
    );
  }

  logout() {
    this.isLoggedIn$.next(false);
    localStorage.removeItem('token');
  }

}
