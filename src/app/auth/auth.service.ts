import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  private backendPort: number = 3333;
  private baseUrl: string = `http://localhost:${this.backendPort}/api`;

  signUp(userData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/sign-up`, userData).pipe(
      tap((response) => {
        this.setToken(response.token);
      })
    );
  }

  signIn(userData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/sign-in`, userData).pipe(
      tap((response) => {
        this.setToken(response.token);
      })
    );
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

}
