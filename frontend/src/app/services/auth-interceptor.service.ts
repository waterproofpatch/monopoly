import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { DialogService } from './dialog.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private dialogService: DialogService
  ) {}

  intercept(req: any, next: any) {
    const loginService = this.injector.get(AuthenticationService);
    const authRequest = req.clone({
      headers: req.headers.append(
        'Authorization',
        'Bearer ' + loginService.token
      ),
    });

    return next.handle(authRequest).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.error('Error Event');
          } else {
            console.log(`error status : ${error.status} ${error.statusText}`);
            switch (error.status) {
              case 400:
                if (req.url.indexOf('register') < 0) {
                  this.dialogService.displayErrorDialog(
                    'Bad request: ' + error.error.error_message
                  );
                } else {
                  console.log('Registration error, letting modal handle it');
                }
                break;
              case 401: //login
                console.log('401 received');
                if (error.error.error_message.indexOf('expired') >= 0) {
                  this.dialogService.displayLoginDialog(
                    error.error.error_message
                  );
                }
                break;
              case 403: //forbidden
                this.dialogService.displayErrorDialog('Unauthorized!');
                break;
              default:
                this.dialogService.displayErrorDialog(
                  'Unknown error ' + error.status
                );
            }
          }
        } else {
          console.error('some thing else happened');
        }
        return throwError(error);
      })
    );
  }
}
