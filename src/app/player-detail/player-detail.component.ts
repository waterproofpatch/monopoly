import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../player';
import { NgForm } from '@angular/forms';
import { LogService } from '../log-service.service';

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
  errorMsg?: string;

  constructor(private logger: LogService) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    this.errorMsg = '';
  }

  makePayment(f: NgForm): void {
    this.errorMsg = '';
    if (!this.player || !this.players) {
      this.logger.log('player or players is NULL!');
      return;
    }

    // the bank has unlimited money
    if (this.player.name != 'Bank' && this.player.money < f.value.amount) {
      this.logger.log('Not enough money!');
      this.errorMsg = 'Not enough money!';
      return;
    }

    // just pay the bank
    if (f.value.otherPlayer == 'Bank') {
      this.player.money = this.player.money - f.value.amount;
      return;
    }

    for (var player of this.players) {
      if (player.name == f.value.otherPlayer) {
        if (this.player.name != 'Bank') {
          this.player.money = this.player.money - f.value.amount;
        }
        player.money += f.value.amount;
      }
    }
  }
}
