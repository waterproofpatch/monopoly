import { Component, OnInit } from '@angular/core';
import { Player } from '../player';
import { PLAYERS } from '../players';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  pieces = ['ship', 'dog', 'car', 'dinosaur'];
  selectedPiece?: string;
  players = PLAYERS;

  constructor() {
    this.selectedPiece = this.pieces[0];
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

  updateSelectedValue(event: string): void {
    this.selectedPiece = event;
  }

  ngOnInit(): void {}
}
