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

  addPlayer(): void {
    // this.players?.push(player);
  }

  updateSelectedValue(event: string): void {
    this.selectedPiece = event;
  }

  ngOnInit(): void {}
}
