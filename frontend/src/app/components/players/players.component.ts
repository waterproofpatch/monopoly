import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Game, Player } from '../../types';
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

  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    public playerService: PlayerService,
    public gameService: GameService
  ) {
    super();
  }

  ngOnInit(): void {
    // monitor for any transactions updates
    this.transactionService.transactions$.subscribe((x) => {
      this.playerService.updatePlayers();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['game']) {
      console.log('game changes for players component');
      this.playerService.invalidatePlayersCache();
      this.playerService.updatePlayers();
    }
  }

  openPieceSelectDialog(player: Player): void {
    this.dialogService
      .displayPieceSelectDialog(
        player,
        this.playerService.getPlayersCache(player.gameId)
      )
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }
}
