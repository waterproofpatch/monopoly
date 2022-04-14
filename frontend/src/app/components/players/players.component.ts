import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Game, Player, Transaction } from '../../types';
import { DialogService } from '../../services/dialog.service';
import { TransactionService } from '../../services/transaction.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { PlayerService } from '../../services/player.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() game?: Game | null; // from game-board

  transactionForm = new FormGroup({
    fromPlayerName: new FormControl(''),
    toPlayerName: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    public playerService: PlayerService,
    public gameService: GameService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('Players is init!');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['game']) {
      console.log('game changes for players component');
      this.playerService.invalidatePlayersCache();
      this.playerService.getPlayersForGame();
    }
  }

  makePayment(): void {
    if (
      this.transactionForm.controls.fromPlayerName.value ==
      this.transactionForm.controls.toPlayerName.value
    ) {
      this.dialogService.displayErrorDialog('Cannot pay yourself!');
      return;
    }

    let toPlayer: Player | null = this.playerService.findPlayerByName(
      this.transactionForm.controls.toPlayerName.value
    );
    let fromPlayer: Player | null = this.playerService.findPlayerByName(
      this.transactionForm.controls.fromPlayerName.value
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

  openPieceSelectDialog(player: Player): void {
    this.dialogService
      .displayPieceSelectDialog(player, this.playerService.getPlayersCache())
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }
}
