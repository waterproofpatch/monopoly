import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player, Transaction } from '../player';
import { LogService } from '../log-service.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent implements OnInit {
  @Input() player?: Player; // from players
  @Input() transactions?: Transaction[]; // from players
  @Input() players?: Player[]; // from players

  // when we 'makePayment'
  @Output() transaction = new EventEmitter<Transaction>();

  transactionForm = new FormGroup({
    otherPlayer: new FormControl(''),
    amount: new FormControl(''),
  });

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
    if (this.transactions) {
      for (let t of this.transactions) {
        if (t.fromPlayer === this.player) {
          ret.push('Paid ' + t.toPlayer.name + ' ' + t.amount);
        } else if (t.toPlayer === this.player) {
          ret.push('Received ' + t.amount + ' from ' + t.fromPlayer.name);
        }
      }
    }
    return ret;
  }

  makePayment(): void {
    this.errorMsg = '';
    if (!this.player || !this.players) {
      this.logger.log('player or players is null');
      this.errorMsg = 'No player or players selected!';
      return;
    }

    if (this.transactionForm.controls.otherPlayer.value == this.player.name) {
      this.errorMsg = 'Cannot pay yourself!';
      return;
    }

    for (var player of this.players) {
      if (player.name == this.transactionForm.controls.otherPlayer.value) {
        let t: Transaction = {
          fromPlayer: this.player,
          toPlayer: player,
          amount: this.transactionForm.controls.amount.value,
        };
        this.transaction.emit(t);
        return;
      }
    }
    this.errorMsg = 'Failed to find other player to pay!';
  }
}
