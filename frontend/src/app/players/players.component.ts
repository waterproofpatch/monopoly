import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Player, Transaction, Game } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { BaseComponent } from 'src/app/base/base/base.component';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent extends BaseComponent implements OnInit {
  @Input() game?: Game; // from game-board
  players: Player[] = [];
  transactions: Transaction[] = [];

  transactionForm = new FormGroup({
    fromPlayerName: new FormControl(''),
    toPlayerName: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    private playerService: PlayerService
  ) {
    super();
    console.log('I am constructing!');
  }

  ngOnInit(): void {
    if (!this.game) {
      this.dialogService.displayErrorDialog(
        'Game not loaded on player component ngoninit!'
      );
      return;
    }
    this.playerService
      .getPlayersHttp(this.game.ID)
      .subscribe((x) => (this.players = x));
    this.transactionService
      .getTransactionsHttp(this.game.ID)
      .subscribe((x) => (this.transactions = x));
    console.log('I am done init for game ' + this.game.ID);
  }

  nonHumanPlayers(): Player[] {
    return this.filteredPlayers(false);
  }

  humanPlayers(): Player[] {
    return this.filteredPlayers(true);
  }

  inGamePlayers(): Player[] {
    return this.players?.filter((x) => x.inGame);
  }

  private filteredPlayers(human: boolean) {
    return this.players?.filter((x) => x.human == human && x.inGame);
  }

  makePayment(): void {
    if (
      this.transactionForm.controls.fromPlayerName.value ==
      this.transactionForm.controls.toPlayerName.value
    ) {
      this.dialogService.displayErrorDialog('Cannot pay yourself!');
      return;
    }

    let toPlayer: Player | null = this.findPlayerByName(
      this.transactionForm.controls.toPlayerName.value
    );
    let fromPlayer: Player | null = this.findPlayerByName(
      this.transactionForm.controls.fromPlayerName.value
    );
    if (!toPlayer || !fromPlayer) {
      this.dialogService.displayErrorDialog(
        'Unable to find to and from player!'
      );
      return;
    }

    let t: Transaction = {
      ID: 0, // filled in by backend
      timestamp: new Date().toISOString(),
      fromPlayerId: fromPlayer.ID,
      toPlayerId: toPlayer.ID,
      amount: this.transactionForm.controls.amount.value,
      GameID: fromPlayer.GameID,
    };
    this.transactionService
      .addTransactionHttp(t)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  findPlayerByName(name: string): Player | null {
    for (let p of this.players) {
      if (p.name == name) {
        return p;
      }
    }
    return null;
  }

  openPieceSelectDialog(player: Player): void {
    if (!this.players || !this.game || this.game == undefined) {
      this.dialogService.displayErrorDialog('Player is not set!');
      return;
    }
    let id = this.game.ID;
    this.dialogService
      .displayPieceSelectDialog(player, this.players)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => {
        this.playerService
          .getPlayersHttp(id)
          .subscribe((x) => (this.players = x));
        this.transactionService
          .getTransactionsHttp(id)
          .subscribe((x) => (this.transactions = x));
      });
  }
}
