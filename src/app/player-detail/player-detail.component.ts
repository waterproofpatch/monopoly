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

  ngOnInit(): void {}

  makePayment(f: NgForm): void {
    console.log(f.value.amount + ' paid to ' + f.value.otherPlayer);
  }
}
