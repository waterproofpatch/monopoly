import { Component, OnInit } from '@angular/core';
import { Player, Transaction } from '../player';
import { PLAYERS } from '../players';
import { LogService } from '../log-service.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  players = PLAYERS;
  transactions: Transaction[] = [];

  constructor(private logger: LogService) {}

  updateGameState(t: Transaction): void {
    this.logger.log('Updating gamestate with transaction ' + t);
    this.transactions.push(t);
  }

  winningPlayer(): Player {
    let winningPlayer: Player = this.players[0];
    for (var p of this.players) {
      // bank and free parking can't win
      if (p.name == 'Bank' || p.name == 'Free Parking') {
        continue;
      }
      if (p.money > winningPlayer.money) {
        winningPlayer = p;
      }
    }
    return winningPlayer;
  }

  ngOnInit(): void {}
}
