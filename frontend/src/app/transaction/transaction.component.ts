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
    public playerService: PlayerService,
    private transactionService: TransactionService,
    private dialogService: DialogService
  ) {
    super();
  }

  undoTransaction(transactionId: number): void {
    this.transactionService.deleteTransaction(transactionId);
  }

  ngOnInit(): void {}
}
