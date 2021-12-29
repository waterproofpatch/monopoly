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
  players: Player[] = PLAYERS;
  transactions: Transaction[] = [];
  playerStates: Array<Player[]> = new Array<Player[]>();
  errorMsg: string = '';

  constructor(private logger: LogService) {}

  undoLast(): void {
    this.errorMsg = '';
    let oldPlayerState = this.playerStates.pop();
    if (!oldPlayerState) {
      this.errorMsg = 'Unable to undo last!';
      return;
    }
    this.players = oldPlayerState.map((x) => Object.assign({}, x));
  }
  updateGameState(t: Transaction): void {
    this.logger.log('Updating gamestate with transaction ' + t);
    this.transactions.push(t);
    let cloned: Player[] = this.players.map((x) => Object.assign({}, x));
    this.playerStates.push(cloned);
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
