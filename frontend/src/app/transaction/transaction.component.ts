import { Component, OnInit, Input } from '@angular/core';

import { Transaction } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  @Input() transaction: Transaction = {
    ID: 0,
    fromPlayerId: 0,
    toPlayerId: 0,
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
    let toPlayer = this.playerService.getPlayerById(
      this.transaction.toPlayerId
    );
    if (toPlayer == null) {
      this.dialogService.displayErrorDialog(
        'Failed finding player ' + this.transaction.toPlayerId
      );
      return '';
    }
    return toPlayer.img;
  }

  getFromPlayerImgUrl(): string {
    let fromPlayer = this.playerService.getPlayerById(
      this.transaction.fromPlayerId
    );
    if (fromPlayer == null) {
      this.dialogService.displayErrorDialog(
        'Failed finding player ' + this.transaction.fromPlayerId
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
      .subscribe((_) => this.dialogService.log('Deleted transaction.'));
  }
}
