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
    return localStorage.getItem(this.storageKey) === 'true';
  }
}