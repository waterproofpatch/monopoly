import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../player';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent implements OnInit {
  @Input() player?: Player; // from players - selectedPlayer
  @Input() players?: Player[]; // from game-board - players
  amount?: number;
  otherPlayer?: Player;

  constructor() {}

  ngOnInit(): void {
    if (this.players) {
      this.otherPlayer = this.players[0];
    }
  }

  makePayment(f: NgForm): void {
    console.log(f.value.amount + ' paid to ' + f.value.otherPlayer);
    if (!this.player || !this.players) {
      console.error('player or players is NULL!');
      return;
    }

    if (this.player.money < f.value.amount) {
      console.error('Not enough money!');
      return;
    }

    for (var player of this.players) {
      if (player.name == f.value.otherPlayer) {
        this.player.money = this.player.money - f.value.amount;
        player.money += f.value.amount;
      }
    }
  }
}
