import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthenticationService } from 'src/app/services/authentication.service';

export interface LoginDialogData {}

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

  constructor(
    private loginService: AuthenticationService,
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

  onLoginClick(): void {
    this.dialogRef.close();
    console.log('logging in with email ' + this.loginForm.controls.email.value);
    this.loginService.login(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
  }
}
