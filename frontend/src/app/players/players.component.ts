import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Player, Transaction, Game } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { BaseComponent } from 'src/app/base/base/base.component';
import { PlayerService } from '../services/player.service';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent extends BaseComponent implements OnInit {
  @Input() game?: Game | undefined | null; // from game-board

  transactionForm = new FormGroup({
    fromPlayerName: new FormControl(''),
    toPlayerName: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    public playerService: PlayerService
  ) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {}

  getPlayersForGame(gameId: number) {
    this.playerService.getPlayersForGame(gameId);
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
    this.transactionService.addTransaction(t);
  }

  findPlayerByName(name: string): Player | null {
    // for (let p of this.players) {
    //   if (p.name == name) {
    //     return p;
    //   }
    // }
    return null;
  }

  openPieceSelectDialog(player: Player): void {
    if (!this.game || this.game == undefined) {
      this.dialogService.displayErrorDialog('Player is not set!');
      return;
    }
    let id = this.game.ID;
    this.dialogService
      .displayPieceSelectDialog(player, [])
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => {
        this.getPlayersForGame(id);
      });
  }
}
