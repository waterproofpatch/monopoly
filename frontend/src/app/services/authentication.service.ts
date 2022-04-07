import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

import { AuthenticationApiService } from '../apis/authentication-api.service';
import { BaseService } from './base.service';
import { DialogService } from './dialog.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JWTData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseService {
  // the local storage key for tokens
  TOKEN_KEY = 'token';

  // this error string is for modals to display login or registration errors.
  error$ = new Subject<string>();

  // this event is for other routes to know when to re-request content behind
  // a backend authentication guard.
  loginEvent$ = new BehaviorSubject<boolean>(false);

  constructor(
    private loginApi: AuthenticationApiService,
    private router: Router,
    private dialogService: DialogService
  ) {
    super();
    if (this.isAuthenticated) {
      this.loginEvent$.next(true);
    }
  }

  email(): string {
    if (!this.token) {
      return '';
    }
    try {
      return (jwt_decode(this.token) as JWTData).email;
    } catch (Error) {
      console.log('error decoding token');
      return '';
    }
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.dialogService.displayLogDialog('Logged out successfully.');
    this.router.navigateByUrl('/');
  }

  register(email: string, password: string) {
    this.loginApi
      .registerHttp(email, password)
      .pipe(
        catchError((error: any) => {
          if (error instanceof HttpErrorResponse) {
            this.error$.next(error.error.error_message);
          } else {
            this.error$.next('Unexpected error');
          }
          return throwError(error);
        })
      )
      .subscribe((x) => {
        console.log('Setting token to ' + x.token);
        localStorage.setItem(this.TOKEN_KEY, x.token);
        this.error$.next(''); // send a benign event so observers can close modals
        this.loginEvent$.next(true);
        this.router.navigateByUrl('/home');
      });
  }

  login(email: string, password: string) {
    this.loginApi
      .loginHttp(email, password)
      .pipe(
        catchError((error: any) => {
          if (error instanceof HttpErrorResponse) {
            this.error$.next(error.error.error_message);
          } else {
            this.error$.next('Unexpected error');
          }
          return throwError(error);
        })
      )
      .subscribe((x) => {
        console.log('Setting token to ' + x.token);
        localStorage.setItem(this.TOKEN_KEY, x.token);
        this.error$.next(''); // send a benign event so observers can close modals
        this.loginEvent$.next(true);
        this.router.navigateByUrl('/home');
      });
  }
}
