import { Component, OnInit } from '@angular/core';

import { Player, Transaction } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';

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
    private gamesServices: GameService,
    public playerService: PlayerService
  ) {
    // start receiving notifications whenever the players+transactions lists change
    this.gamesServices.gameObservable.subscribe((x) => {
      this.players = x.players;
      this.transactions = x.transactions;
    });
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
    });
  }

  newGame(): void {
    this.gamesServices
      .getGameHttp()
      .subscribe((_) =>
        this.dialogService.displayLogDialog('New game started!')
      );
  }

  ngOnInit(): void {}
}
