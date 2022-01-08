import { Inject, Component, Injectable } from '@angular/core';
import { Player } from '../types';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TransactionService } from '../transaction-service/transaction.service';
import { Transaction } from '../types';
export interface ErrorDialogData {
  errorMsg: string;
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
    public dialogRef: MatDialogRef<PieceSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PieceSelectDialogData
  ) {}

  passGo(): void {
    this.dialogRef.close();
    const bank: Player[] = this.data.players.filter((x) => x.name == 'Bank');

    let t: Transaction = {
      toPlayer: this.data.player,
      fromPlayer: bank[0],
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
      toPlayer: this.data.player,
      fromPlayer: freeParking[0],
      amount: freeParking[0].money,
      timestamp: new Date().toISOString(),
    };
    this.transactionService.handleTransaction(t);
  }

  selectPlayer(newPlayer: Player, oldPlayer: Player) {
    console.log(
      'player selected: ' + newPlayer.name + ' from ' + oldPlayer.name
    );
    [newPlayer.name, oldPlayer.name] = [oldPlayer.name, newPlayer.name];
    [newPlayer.img, oldPlayer.img] = [oldPlayer.img, newPlayer.img];
  }

  onOkClick(): void {
    this.dialogRef.close();
  }
}
