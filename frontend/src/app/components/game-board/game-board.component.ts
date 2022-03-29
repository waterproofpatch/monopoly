import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DialogService } from '../../services/dialog/dialog.service';
import { TransactionService } from '../../services/transaction.service';
import { PlayerService } from '../../services/player.service';
import { GameService } from '../../services/game.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent extends BaseComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    public gameService: GameService,
    public playerService: PlayerService
  ) {
    super();
    this.gameService.getGames();
  }

  login(): void {
    this.dialogService.displayLoginDialog();
  }

  register(): void {
    this.dialogService.displayRegisterDialog();
  }

  newGame(): void {
    this.dialogService
      .displayNewGameDialog()
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        this.gameService.newGame(name);
      });
  }

  ngOnInit(): void {}
}
