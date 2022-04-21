import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { GameService } from '../../services/game.service';
import { AuthenticationService } from '../../services/authentication.service';
import { TransactionService } from '../../services/transaction.service';
import { PlayerService } from '../../services/player.service';
import { BaseComponent } from '../base/base.component';
import { DialogService } from 'src/app/services/dialog.service';
import { Transaction, Player, Game } from 'src/app/types';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent extends BaseComponent implements OnInit {
  transactionForm = new FormGroup({
    fromPlayerName: new FormControl(''),
    toPlayerName: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(
    public gameService: GameService,
    public authenticationService: AuthenticationService,
    public playerService: PlayerService,
    private transactionService: TransactionService,
    private dialogService: DialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.authenticationService.loginEvent$.subscribe((x) => {
      if (x) {
        this.gameService.getGames();
      }
    });
  }
  makePayment(game: Game): void {
    if (
      this.transactionForm.controls.fromPlayerName.value ==
      this.transactionForm.controls.toPlayerName.value
    ) {
      this.dialogService.displayErrorDialog('Cannot pay yourself!');
      return;
    }

    let toPlayer: Player | null = this.playerService.findPlayerByName(
      this.transactionForm.controls.toPlayerName.value,
      game.ID
    );
    let fromPlayer: Player | null = this.playerService.findPlayerByName(
      this.transactionForm.controls.fromPlayerName.value,
      game?.ID
    );
    if (!toPlayer || !fromPlayer) {
      this.dialogService.displayErrorDialog(
        'Unable to find to and from player!'
      );
      return;
    }
    let t: Transaction = {
      ID: 0, // filled in by backend
      timestamp: new Date().toISOString(),
      fromPlayerId: fromPlayer.ID,
      toPlayerId: toPlayer.ID,
      amount: this.transactionForm.controls.amount.value,
      gameId: fromPlayer.gameId,
    };
    this.transactionService.addTransaction(t, fromPlayer.gameId);
  }
}
