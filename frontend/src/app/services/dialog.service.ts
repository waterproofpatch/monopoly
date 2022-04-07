import { Observable, of } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Player } from '../types';
import { BaseService } from './base.service';
import { RegisterDialogComponent } from 'src/app/components/register-dialog/register-dialog.component';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { NewGameDialogComponent } from 'src/app/components/new-game-dialog/new-game-dialog.component';
import { LogDialogComponent } from 'src/app/components/log-dialog/log-dialog.component';
import { ErrorDialogComponent } from 'src/app/components/error-dialog/error-dialog.component';
import { PieceSelectDialogComponent } from 'src/app/components/piece-select-dialog/piece-select-dialog.component';

export interface NewGameDialogData {}

@Injectable({
  providedIn: 'root',
})
export class DialogService extends BaseService {
  dialogRef: any = undefined;
  constructor(private dialog: MatDialog) {
    super();
  }

  log(msg: any) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }

  /**
   * Display the registration modal.
   * @returns
   */
  displayRegisterDialog() {
    this.dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '350px',
      height: '500px',
      data: {},
    });
    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
    return this.dialogRef;
  }

  /**
   * Display the login modal.
   * @param message optional message to display at the top of the modal.
   * @returns
   */
  displayLoginDialog(message?: string) {
    if (this.dialogRef) {
      return;
    }
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '350px',
      height: '500px',
      data: { message: message },
    });
    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
    return this.dialogRef;
  }

  /**
   * Display the new game modal.
   * @returns
   */
  displayNewGameDialog() {
    this.dialogRef = this.dialog.open(NewGameDialogComponent, {
      width: '350px',
      data: {},
    });
    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
    return this.dialogRef;
  }

  /**
   * open the piece dialog where we can change players, pass go, etc.
   * @param player the player which was selected.
   * @param players the list of all players for this game.
   * @returns
   */
  displayPieceSelectDialog(player: Player, players: Player[]) {
    this.dialogRef = this.dialog.open(PieceSelectDialogComponent, {
      width: '350px',
      data: { player: player, players: players },
    });

    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));

    return this.dialogRef;
  }

  /**
   * display an error modal.
   * @param errorMsg the error message to display.
   */
  displayErrorDialog(errorMsg: string): void {
    this.dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: { errorMsg: errorMsg },
    });

    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
  }

  /**
   * display a generic log message as a modal.
   * @param logMsg the message to display
   */
  displayLogDialog(logMsg: string): void {
    this.dialogRef = this.dialog.open(LogDialogComponent, {
      width: '250px',
      data: { logMsg: logMsg },
    });

    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
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
