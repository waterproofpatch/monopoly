import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TransactionService } from 'src/app/services/transaction.service';
import { PlayerService } from 'src/app/services/player.service';
import { Transaction, Player } from '../../types';
import { DialogService } from 'src/app/services/dialog.service';

export interface PieceSelectDialogData {
  player: Player;
  players: Player[];
}

@Component({
  selector: 'app-piece-select-dialog',
  templateUrl: './piece-select-dialog.component.html',
  styleUrls: ['./piece-select-dialog.component.css'],
})
export class PieceSelectDialogComponent implements OnInit {
  constructor(
    private transactionService: TransactionService,
    private dialogService: DialogService,
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<PieceSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PieceSelectDialogData
  ) {}

  ngOnInit(): void {}

  passGo(): void {
    const bank: Player[] = this.data.players.filter((x) => x.name == 'Bank');

    let t: Transaction = {
      ID: 0, // filled in by server
      toPlayerId: this.data.player.ID,
      fromPlayerId: bank[0].ID,
      amount: 200,
      timestamp: new Date().toISOString(),
      gameId: this.data.player.gameId,
    };
    this.transactionService.addTransaction(t, this.data.player.gameId);
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
      gameId: this.data.player.gameId,
    };
    this.transactionService.addTransaction(t, this.data.player.gameId);
  }

  remove(): void {
    this.dialogRef.close();
    console.log('Deleting player ' + this.data.player.ID);
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
