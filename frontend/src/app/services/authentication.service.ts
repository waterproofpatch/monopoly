import { Injectable } from '@angular/core';
import { AuthenticationApiService } from '../apis/authentication-api.service';
import { BaseService } from './base.service';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DialogService } from './dialog.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseService {
  TOKEN_KEY = 'token';
  error$ = new Subject<string>();

  constructor(
    private loginApi: AuthenticationApiService,
    private router: Router,
    private dialogService: DialogService
  ) {
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
    this.dialogService.displayLogDialog('Logged out successfully.');
    this.router.navigateByUrl('/');
  }

  register(email: string, password: string) {
    this.loginApi
      .registerHtp(email, password)
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
        this.router.navigateByUrl('/');
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
        this.router.navigateByUrl('/');
      });
  }
}
