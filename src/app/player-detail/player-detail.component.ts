import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player, Transaction } from '../player';
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
  @Output() transaction = new EventEmitter<Transaction>();
  amount?: number;
  otherPlayer?: Player;

  constructor(private logger: LogService) {}

  ngOnInit(): void {}

  makePayment(f: NgForm): void {
    if (!this.player || !this.players) {
      this.logger.log('player or players is null');
      return;
    }

    for (var player of this.players) {
      if (player.name == f.value.otherPlayer) {
        let t: Transaction = {
          fromPlayer: this.player,
          toPlayer: player,
          amount: f.value.amount,
        };
        this.transaction.emit(t);
      }
    }
  }
}
