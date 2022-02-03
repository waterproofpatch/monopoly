import { Component, OnInit } from '@angular/core';

import { Player, Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { TransactionService } from '../transaction-service/transaction.service';
import { PlayerService } from '../player-service/player.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  players: Player[] = [];
  transactions: Transaction[] = [];

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService,
    public playerService: PlayerService
  ) {
    // start receiving notifications whenever the transaction list changes
    this.transactionService.transactionObservable.subscribe(
      (x) => (this.transactions = x)
    );
    // start receiving notifications whenever the players list changes
    this.playerService.playerObservable.subscribe((x) => {
      for (let p of this.players) {
        let newPlayer = x.filter((x) => x.ID == p.ID)[0];
        p.human = newPlayer.human;
        p.money = newPlayer.money;
        p.img = newPlayer.img;
        p.inGame = newPlayer.inGame;
        p.name = newPlayer.name;
      }
      // this.players = x;
      // for money transition animation, we need to set the attribute, not change the entire list
      // for (let newP of x) {
      //   for (let oldP of this.players) {
      //     if (oldP.name == newP.name) {
      //       oldP.money = newP.money;
      //     }
      //   }
      // }
    });
  }

  newGame(): void {
    this.dialogService.displayLogDialog('New game started!');

    // get the initial set of players and transactions
    this.playerService
      .getPlayersHttp()
      .subscribe((players) => (this.players = players));
    this.transactionService.getTransactionsHttp().subscribe();
  }

  ngOnInit(): void {}
}
