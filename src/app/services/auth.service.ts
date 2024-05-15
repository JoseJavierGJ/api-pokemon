import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor() {}

  login(username: string, password: string): boolean {
    if (username === 'pikachu' && password === '123456') {
      this.isLoggedIn = true;
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
