import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { map, takeUntil, exhaustMap } from 'rxjs/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';

import { TransactionService } from '../services/transaction.service';
import { Game, Transaction, Player } from '../types';
import { BaseComponent } from 'src/app/base/base/base.component';
import { DialogService } from '../services/dialog-service/dialog.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent extends BaseComponent implements OnInit {
  @Input() game?: Game; // from game-board
  transactions: Transaction[] = [];

  fromPlayerId$ = new BehaviorSubject<number>(0);
  toPlayerId$ = new BehaviorSubject<number>(0);

  fromPlayerImgUrl$: Observable<string> = this.toPlayerId$.pipe(
    exhaustMap((playerId) =>
      this.playerService.getPlayerByIdHttp(playerId).pipe(map((x) => x.img))
    ),
    takeUntil(this.destroy$)
  );
  toPlayerImgUrl$: Observable<string> = this.fromPlayerId$.pipe(
    exhaustMap((playerId) =>
      this.playerService.getPlayerByIdHttp(playerId).pipe(map((x) => x.img))
    ),
    takeUntil(this.destroy$)
  );

  constructor(
    private transactionService: TransactionService,
    private dialogService: DialogService,
    private playerService: PlayerService
  ) {
    super();
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    for (const propname in changes) {
      console.log('Propname changed: ' + propname);
      console.log('Propname changed to: ' + changes[propname]);
      if (propname === 'game') {
        console.log(
          'game changed to: ' +
            changes[propname].currentValue.ID +
            ' from ' +
            changes[propname].previousValue
        );
        this.getTransactionsForGame(changes[propname].currentValue.ID);
      }
    }
  }

  getTransactionsForGame(gameId: number) {
    this.transactionService.getTransactionsHttp(gameId).subscribe((x) => {
      this.transactions = x;
    });
  }

  setupFromPlayerId(playerId: number): void {
    this.fromPlayerId$.next(playerId);
  }
  setupToPlayerId(playerId: number): void {
    this.toPlayerId$.next(playerId);
  }

  undoTransaction(transactionId: number): void {
    this.transactionService
      .deleteTransactionHttp(transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => this.dialogService.log('Deleted transaction.'));
  }
}
