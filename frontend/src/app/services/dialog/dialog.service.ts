import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Inject, Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { Player } from '../../types';
import { TransactionService } from '../transaction.service';
import { PlayerService } from '../player.service';
import { Transaction } from '../../types';
import { BaseService } from '../base.service';
import { LoginService } from '../login.service';

export interface ErrorDialogData {
  errorMsg: string;
}
export interface LogDialogData {
  logMsg: string;
}
export interface PieceSelectDialogData {
  player: Player;
  players: Player[];
}
export interface NewGameDialogData {}
export interface LoginDialogData {}
export interface RegisterDialogData {}

@Injectable({
  providedIn: 'root',
})
export class DialogService extends BaseService {
  constructor(private dialog: MatDialog) {
    super();
  }

  log(msg: any) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }
  displayRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialog, {
      width: '350px',
      height: '500px',
      data: {},
    });
    return dialogRef;
  }
  displayLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '350px',
      height: '500px',
      data: {},
    });
    return dialogRef;
  }

  displayNewGameDialog() {
    const dialogRef = this.dialog.open(NewGameDialog, {
      width: '350px',
      data: {},
    });
    return dialogRef;
  }

  displayPieceSelectDialog(player: Player, players: Player[]) {
    const dialogRef = this.dialog.open(PieceSelectDialog, {
      width: '350px',
      data: { player: player, players: players },
    });
    return dialogRef;
  }

  displayErrorDialog(errorMsg: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      width: '250px',
      data: { errorMsg: errorMsg },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        console.log('The dialog was closed');
      });
  }

  displayLogDialog(logMsg: string): void {
    const dialogRef = this.dialog.open(LogDialog, {
      width: '250px',
      data: { logMsg: logMsg },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        console.log('The dialog was closed');
      });
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error == null) {
        this.displayErrorDialog('Unknown error - failed: ' + operation);
      } else {
        this.displayErrorDialog(
          `${operation} failed: ${error.error.error_message}`
        );
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
@Component({
  selector: 'register-dialog',
  styleUrls: ['./register-dialog.css'],
  templateUrl: './register-dialog.html',
})
export class RegisterDialog {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<RegisterDialog>,
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
    this.dialogRef.close();
    console.log(
      'registering with email ' + this.registerForm.controls.email.value
    );
    this.loginService.register(
      this.registerForm.controls.email.value,
      this.registerForm.controls.password.value
    );
  }
}

@Component({
  selector: 'login-dialog',
  styleUrls: ['./login-dialog.css'],
  templateUrl: './login-dialog.html',
})
export class LoginDialog {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LoginDialogData
  ) {
    dialogRef.beforeClosed().subscribe();
  }

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
@Component({
  selector: 'new-game-dialog',
  templateUrl: './new-game-dialog.html',
})
export class NewGameDialog {
  newGameForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<NewGameDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewGameDialogData
  ) {
    dialogRef
      .beforeClosed()
      .subscribe(() => dialogRef.close(this.newGameForm.controls.name.value));
  }
  getErrorMessage() {
    if (this.newGameForm.controls.name.hasError('required')) {
      return 'You must enter a value';
    }

    return this.newGameForm.controls.name.hasError('name')
      ? 'Not a valid email'
      : '';
  }

  onOkClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'log-dialog',
  templateUrl: './log-dialog.html',
})
export class LogDialog {
  constructor(
    public dialogRef: MatDialogRef<LogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LogDialogData
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.html',
})
export class ErrorDialog {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'piece-select-dialog',
  templateUrl: './piece-select-dialog.html',
  styleUrls: ['./piece-select-dialog.css'],
})
export class PieceSelectDialog extends BaseService {
  constructor(
    private transactionService: TransactionService,
    private dialogService: DialogService,
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<PieceSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PieceSelectDialogData
  ) {
    super();
  }

  passGo(): void {
    const bank: Player[] = this.data.players.filter((x) => x.name == 'Bank');

    let t: Transaction = {
      ID: 0, // filled in by server
      toPlayerId: this.data.player.ID,
      fromPlayerId: bank[0].ID,
      amount: 200,
      timestamp: new Date().toISOString(),
      GameID: this.data.player.GameID,
    };
    this.transactionService.addTransaction(t, this.data.player.GameID);
    this.dialogRef.close();
  }

  collectFreeParking(): void {
    this.dialogRef.close();
    const freeParking: Player[] = this.data.players.filter(
      (x) => x.name == 'Free Parking'
    );

    if (freeParking[0].money == 0) {
      this.dialogService.displayErrorDialog('No money in free parking!');
      return;
    }

    let t: Transaction = {
      ID: 0, // filled in by server
      toPlayerId: this.data.player.ID,
      fromPlayerId: freeParking[0].ID,
      amount: freeParking[0].money,
      timestamp: new Date().toISOString(),
      GameID: this.data.player.GameID,
    };
    this.transactionService.addTransaction(t, this.data.player.GameID);
  }

  remove(): void {
    this.dialogRef.close();
    this.playerService.deletePlayer(this.data.player);
  }

  selectPlayer(newPlayer: Player, oldPlayer: Player) {
    this.dialogRef.close();
    this.playerService.changePlayer(oldPlayer, newPlayer);
  }

  onOkClick(): void {
    this.dialogRef.close();
  }
}
