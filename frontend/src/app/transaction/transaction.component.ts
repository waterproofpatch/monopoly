import { Component, OnInit, Input } from '@angular/core';
import { Player, Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { TransactionService } from '../transaction-service/transaction.service';
import { PlayerService } from '../player-service/player.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  @Input() transaction: Transaction = {
    ID: 0,
    fromPlayer: 'Loading...',
    toPlayer: 'Loading...',
    amount: 0,
    timestamp: 'N/A',
  }; // from game-board

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {}
  getToPlayerImgUrl(): string {
    let toPlayer = this.playerService.getPlayerByName(
      this.transaction.toPlayer
    );
    if (toPlayer == null) {
      this.dialogService.displayErrorDialog(
        'Failed finding player ' + this.transaction.toPlayer
      );
      return '';
    }
    return toPlayer.img;
  }

  getFromPlayerImgUrl(): string {
    let fromPlayer = this.playerService.getPlayerByName(
      this.transaction.fromPlayer
    );
    if (fromPlayer == null) {
      this.dialogService.displayErrorDialog(
        'Failed finding player ' + this.transaction.fromPlayer
      );
      return '';
    }
    return fromPlayer.img;
  }

  undoTransaction(): void {
    if (!this.transaction) {
      this.dialogService.displayErrorDialog('No transaction set!');
      return;
    }

    this.transactionService
      .deleteTransactionHttp(this.transaction)
      .subscribe((x) =>
        this.dialogService.displayLogDialog('Got transactions' + x)
      );
  }
}
