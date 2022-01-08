import { Component, OnInit } from '@angular/core';
import { Player, Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { TransactionService } from '../transaction-service/transaction.service';
import { PlayerService } from '../player-service/player.service';
import { GameServiceService } from '../game-service.service';
import { Game } from '../types';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  playerStates: Array<Player[]> = new Array<Player[]>();
  transactionStates: Array<Transaction[]> = new Array<Transaction[]>();
  games: Game[] = [];

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService,
    public playerService: PlayerService,
    private gameService: GameServiceService
  ) {
    // whenever a component registers a transaction, process it here.
    transactionService.transaction$.subscribe((transaction) => {
      this.updateGameState(transaction);
    });

    gameService.game$.subscribe((game) => {
      this.games.push(game);
    });
  }

  newGame(): void {
    this.reset();
    this.gameService.newGame('new game name');
  }

  gameStarted(): boolean {
    return this.games.length > 0;
  }

  reset(): void {
    this.playerService.reset();
    this.transactionService.reset();
  }

  updateGameState(t: Transaction): void {
    this.dialogService.log('Updating gamestate with transaction ' + t);
    let clonedPlayers: Player[] = this.playerService
      .getPlayers()
      .map((x) => Object.assign({}, x));
    let clonedTransactions: Transaction[] = this.transactionService
      .getTransactions()
      .map((x) => Object.assign({}, x));
    this.playerStates.push(clonedPlayers);
    this.transactionStates.push(clonedTransactions);
  }

  ngOnInit(): void {}
}
