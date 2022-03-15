import { Input, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, exhaustMap, map } from 'rxjs/operators';

import { BaseComponent } from '../base/base/base.component';
import { Transaction, Player } from '../types';
import { PlayerService } from '../services/player.service';
import { TransactionService } from '../services/transaction.service';
import { DialogService } from '../services/dialog-service/dialog.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent extends BaseComponent implements OnInit {
  @Input() transaction?: Transaction;

  toPlayerImgUrl: string = '';
  fromPlayerImgUrl: string = '';

  constructor(
    private playerService: PlayerService,
    private transactionService: TransactionService,
    private dialogService: DialogService
  ) {
    super();
    this.playerService.players$.subscribe((x) => {
      if (!this.transaction) {
        return;
      }
      this.toPlayerImgUrl = x.filter(
        (x) => x.ID == this.transaction?.toPlayerId
      )[0].img;
    });
    this.playerService.players$.subscribe((x) => {
      if (!this.transaction) {
        return;
      }
      this.fromPlayerImgUrl = x.filter(
        (x) => x.ID == this.transaction?.fromPlayerId
      )[0].img;
    });
  }

  undoTransaction(transactionId: number): void {
    this.transactionService.deleteTransaction(transactionId);
  }

  ngOnInit(): void {
    if (!this.transaction) {
      return;
    }
  }
}
