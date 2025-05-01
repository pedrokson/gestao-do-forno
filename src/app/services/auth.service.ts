import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageKey = 'isLoggedIn'; // chave que vai no localStorage

  login() {
    localStorage.setItem(this.storageKey, 'true');
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false; // 👈 evita erro no SSR
    return localStorage.getItem(this.storageKey) === 'true'; // Corrigido para usar 'isLoggedIn'
  }
}
