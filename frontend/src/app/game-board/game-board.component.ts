import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Player, Transaction } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { BaseComponent } from '../base/base/base.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent extends BaseComponent implements OnInit {
  players: Player[] = [];
  transactions: Transaction[] = [];

  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    private gamesServices: GameService,
    public playerService: PlayerService
  ) {
    super();
    // start receiving notifications whenever the players+transactions lists change
    this.gamesServices.gameObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.playerService.setPlayers(x.players);
        this.transactionService.setTransactions(x.transactions);
      });
    this.playerService.playerObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        if (this.players.length == 0) {
          this.players = x;
          return;
        }
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) =>
        this.dialogService.displayLogDialog('New game started!')
      );
  }

  ngOnInit(): void {}
}
