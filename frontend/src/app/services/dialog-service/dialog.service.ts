import { Observable, of } from 'rxjs';
import { Inject, Component, Injectable } from '@angular/core';

import { Player } from '../../types';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TransactionService } from '../../services/transaction.service';
import { PlayerService } from '../../services/player.service';
import { Transaction } from '../../types';

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

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  log(msg: any) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }

  displayPieceSelectDialog(player: Player, players: Player[]) {
    const dialogRef = this.dialog.open(PieceSelectDialog, {
      width: '350px',
      data: { player: player, players: players },
    });
  }

  displayErrorDialog(errorMsg: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      width: '250px',
      data: { errorMsg: errorMsg },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  displayLogDialog(logMsg: string): void {
    const dialogRef = this.dialog.open(LogDialog, {
      width: '250px',
      data: { logMsg: logMsg },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
      this.displayErrorDialog(
        `${operation} failed: ${error.error.error_message}`
      );

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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
export class PieceSelectDialog {
  constructor(
    private transactionService: TransactionService,
    private dialogService: DialogService,
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<PieceSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PieceSelectDialogData
  ) {}

  passGo(): void {
    this.dialogRef.close();
    const bank: Player[] = this.data.players.filter((x) => x.name == 'Bank');

    let t: Transaction = {
      ID: 0, // filled in by server
      toPlayerId: this.data.player.ID,
      fromPlayerId: bank[0].ID,
      amount: 200,
      timestamp: new Date().toISOString(),
    };
    this.transactionService.handleTransaction(t);
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
    };
    this.transactionService.handleTransaction(t);
  }

  remove(): void {
    this.playerService
      .deletePlayerHttp(this.data.player)
      .subscribe((_) => this.dialogService.displayLogDialog('Removed player!'));
    this.dialogRef.close();
  }

  selectPlayer(newPlayer: Player, oldPlayer: Player) {
    console.log(
      'player selected: ' + newPlayer.name + ' from ' + oldPlayer.name
    );
    this.playerService
      .changePlayersHttp(oldPlayer, newPlayer)
      .subscribe((_) => {
        this.dialogService.displayLogDialog('Changed players!');
        this.dialogRef.close();
      });
  }

  onOkClick(): void {
    this.dialogRef.close();
  }
}
