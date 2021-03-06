import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthenticationService } from 'src/app/services/authentication.service';

export interface RegisterDialogData {}

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css'],
})
export class RegisterDialogComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  error = '';

  ngOnInit(): void {}

  constructor(
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegisterDialogData
  ) {
    dialogRef.beforeClosed().subscribe();
  }

  getErrorMessage() {
    if (this.registerForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.registerForm.controls.email.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  onRegisterClick(): void {
    this.error = '';
    this.authenticationService.error$.subscribe((error: string) => {
      console.log('Got event ' + error);
      if (error.length > 0) {
        this.error = error;
      } else {
        this.dialogRef.close();
        this.error = '';
      }
    });
    console.log(
      'registering with email ' + this.registerForm.controls.email.value
    );
    this.authenticationService.register(
      this.registerForm.controls.email.value,
      this.registerForm.controls.password.value
    );
  }
}
