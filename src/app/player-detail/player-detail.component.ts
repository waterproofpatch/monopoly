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
  @Input() player?: Player; // from players
  @Input() players?: Player[]; // from players

  // when we 'makePayment'
  @Output() transaction = new EventEmitter<Transaction>();

  // form values
  amount?: number;
  otherPlayer?: Player;

  // error display
  errorMsg: string = '';

  constructor(private logger: LogService) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    this.errorMsg = '';
  }

  getOtherPlayers(): Player[] {
    if (!this.player || !this.players) {
      return [];
    }
    let ret: Player[] = [];
    for (let p of this.players) {
      if (p.name != this.player.name) {
        ret.push(p);
      }
    }
    return ret;
  }

  getTransactionsStrings(): string[] {
    if (!this.player) {
      return [];
    }
    let ret: string[] = [];
    for (let t of this.player.transactions) {
      if (t.fromPlayer === this.player) {
        ret.push('Paid ' + t.toPlayer.name + ' ' + t.amount);
      } else if (t.toPlayer === this.player) {
        ret.push('Received ' + t.amount + ' from ' + t.fromPlayer.name);
      }
    }
    return ret;
  }

  makePayment(f: NgForm): void {
    if (!this.player || !this.players) {
      this.logger.log('player or players is null');
      return;
    }

    if (f.value.otherPlayer == this.player.name) {
      this.errorMsg = 'Cannot pay yourself!';
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
