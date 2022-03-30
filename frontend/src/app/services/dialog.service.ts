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

  displayLoginDialog() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '350px',
      height: '500px',
      data: {},
    });
    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
    return this.dialogRef;
  }

  displayNewGameDialog() {
    this.dialogRef = this.dialog.open(NewGameDialogComponent, {
      width: '350px',
      data: {},
    });
    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
    return this.dialogRef;
  }

  displayPieceSelectDialog(player: Player, players: Player[]) {
    this.dialogRef = this.dialog.open(PieceSelectDialogComponent, {
      width: '350px',
      data: { player: player, players: players },
    });

    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));

    return this.dialogRef;
  }

  displayErrorDialog(errorMsg: string): void {
    this.dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: { errorMsg: errorMsg },
    });

    this.dialogRef.afterClosed().pipe(takeUntil(this.destroy$)),
      finalize(() => (this.dialogRef = undefined));
  }

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
