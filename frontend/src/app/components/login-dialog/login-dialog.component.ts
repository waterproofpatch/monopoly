import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';

export interface LoginDialogData {
  message: string;
}

@Component({
  selector: 'app-login-dialog',
  styleUrls: ['./login-dialog.component.css'],
  templateUrl: './login-dialog.component.html',
})
export class LoginDialogComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  error: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginDialogData
  ) {
    dialogRef.beforeClosed().subscribe();
  }

  ngOnInit(): void {}

  getErrorMessage() {
    if (this.loginForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.loginForm.controls.email.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  closeAndPopRegistration() {
    console.log('closing and popping registration');
    this.dialogRef.close();
    this.dialogService.displayRegisterDialog();
  }

  onLoginClick(): void {
    this.error = '';
    this.authenticationService.error$.subscribe((error: string) => {
      if (error.length > 0) {
        this.error = error;
      } else {
        this.dialogRef.close();
        this.error = '';
      }
    });
    console.log('logging in with email ' + this.loginForm.controls.email.value);
    this.authenticationService.login(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
  }
}
