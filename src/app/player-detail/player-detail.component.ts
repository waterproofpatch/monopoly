import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../player';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent implements OnInit {
  @Input() player?: Player;
  @Input() players?: Player[];
  amount?: number;
  otherPlayer?: Player;

  constructor() {}

  ngOnInit(): void {}

  makePayment(f: NgForm): void {
    if (!this.otherPlayer) {
      console.log('Otherplayer is null!');
      return;
    }
    console.log('Paying ' + this.amount + ' to ' + this.otherPlayer.name);
  }
}
