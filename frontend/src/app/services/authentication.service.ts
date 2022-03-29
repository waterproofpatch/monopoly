import { Injectable } from '@angular/core';
import { AuthenticationApiService } from '../apis/authentication-api.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseService {
  TOKEN_KEY = 'token';
  constructor(private loginApi: AuthenticationApiService) {
    super();
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  register(email: string, password: string) {
    this.loginApi.registerHtp(email, password).subscribe((x) => {
      console.log('Setting token to ' + x.token);
      localStorage.setItem(this.TOKEN_KEY, x.token);
    });
  }

  login(email: string, password: string) {
    this.loginApi.loginHttp(email, password).subscribe((x) => {
      console.log('Setting token to ' + x.token);
      localStorage.setItem(this.TOKEN_KEY, x.token);
    });
  }
}
