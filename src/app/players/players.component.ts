import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Player, Transaction } from '../player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  @Input() transactions?: Transaction[]; // from game-board
  @Output() gameState = new EventEmitter<Transaction>();

  constructor() {}

  ngOnInit(): void {}

  updateGameState(t: Transaction): void {
    // forward the event up to the game board
    this.gameState.emit(t);
  }
}
