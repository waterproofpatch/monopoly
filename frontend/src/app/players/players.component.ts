import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Player, Transaction } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { BaseComponent } from 'src/app/base/base/base.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent extends BaseComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  @Input() transactions?: Transaction[] | null; // from game-board

  transactionForm = new FormGroup({
    fromPlayerName: new FormControl(''),
    toPlayerName: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService
  ) {
    super();
  }

  ngOnInit(): void {}

  nonHumanPlayers(): Player[] {
    return this.filteredPlayers(false);
  }

  humanPlayers(): Player[] {
    return this.filteredPlayers(true);
  }

  inGamePlayers(): Player[] {
    if (!this.players) {
      this.dialogService.displayErrorDialog('Players not loaded yet!');
      return [];
    }
    return this.players?.filter((x) => x.inGame);
  }

  private filteredPlayers(human: boolean) {
    if (!this.players) {
      this.dialogService.displayErrorDialog('Players not loaded yet!');
      return [];
    }
    return this.players?.filter((x) => x.human == human && x.inGame);
  }

  makePayment(): void {
    this.dialogService.log('Handling transaction');
    if (!this.players) {
      this.dialogService.displayErrorDialog('No players available!');
      return;
    }

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
    if (!this.players) {
      return null;
    }

    for (let p of this.players) {
      if (p.name == name) {
        return p;
      }
    }
    return null;
  }
}
