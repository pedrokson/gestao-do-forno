import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageKey = 'token'; 
  
  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {
    return this.http.post<{ token: string }>('http://localhost:3000/login', { email, senha }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      })
    );
  }
  
  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false; // 👈 evita erro no SSR
    return !!localStorage.getItem(this.storageKey);
  }
}
