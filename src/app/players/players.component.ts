import { NONE_TYPE } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../player';
import { PLAYERS } from '../players';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  selectedPlayer?: Player;

  constructor() {}

  ngOnInit(): void {}

  onSelect(player: Player): void {
    this.selectedPlayer = player;
  }
}