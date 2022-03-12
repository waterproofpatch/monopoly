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

  fromPlayerImgUrl$ = new BehaviorSubject<number>(0);
  toPlayerImgUrl$ = new BehaviorSubject<number>(0);

  getFromPlayerImgUrl$: Observable<string> = this.fromPlayerImgUrl$.pipe(
    exhaustMap((playerId) =>
      this.playerService.getPlayerByIdHttp(playerId).pipe(map((x) => x.img))
    ),
    takeUntil(this.destroy$)
  );
  getToPlayerImgUrl$: Observable<string> = this.toPlayerImgUrl$.pipe(
    exhaustMap((playerId) =>
      this.playerService.getPlayerByIdHttp(playerId).pipe(map((x) => x.img))
    ),
    takeUntil(this.destroy$)
  );

  constructor(
    private playerService: PlayerService,
    private transactionService: TransactionService,
    private dialogService: DialogService
  ) {
    super();
  }

  undoTransaction(transactionId: number): void {
    this.transactionService
      .deleteTransactionHttp(transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => this.dialogService.log('Deleted transaction.'));
  }

  ngOnInit(): void {
    if (!this.transaction) {
      return;
    }
    this.fromPlayerImgUrl$.next(this.transaction.fromPlayerId);
    this.toPlayerImgUrl$.next(this.transaction.toPlayerId);
  }
}
