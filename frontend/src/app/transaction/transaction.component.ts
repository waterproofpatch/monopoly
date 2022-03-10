import { Component, OnInit, Input } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Transaction, Player } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { PlayerService } from '../services/player.service';
import { BaseComponent } from '../base/base/base.component';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent extends BaseComponent implements OnInit {
  @Input() transaction: Transaction = {
    ID: 0,
    fromPlayerId: 0,
    toPlayerId: 0,
    amount: 0,
    timestamp: 'N/A',
    GameID: 0,
  }; // from players

  fromPlayer: Player | null = null;
  toPlayer: Player | null = null;

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService,
    private playerService: PlayerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.playerService
      .getPlayerByIdHttp(this.transaction.fromPlayerId)
      .subscribe((x) => (this.fromPlayer = x));
    this.playerService
      .getPlayerByIdHttp(this.transaction.toPlayerId)
      .subscribe((x) => (this.toPlayer = x));
  }

  getToPlayerImgUrl(): string {
    if (!this.toPlayer) {
      this.dialogService.displayErrorDialog('toPlayer is NULL!');
      return '';
    }
    return this.toPlayer.img;
  }

  getFromPlayerImgUrl(): string {
    if (!this.fromPlayer) {
      this.dialogService.displayErrorDialog('fromPlayer is NULL!');
      return '';
    }
    return this.fromPlayer.img;
  }

  undoTransaction(): void {
    if (!this.transaction) {
      this.dialogService.displayErrorDialog('No transaction set!');
      return;
    }

    this.transactionService
      .deleteTransactionHttp(this.transaction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => this.dialogService.log('Deleted transaction.'));
  }
}
