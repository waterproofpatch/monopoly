import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Player, Transaction } from '../types';
import { DialogService } from '../dialog.service';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  @Input() transactions?: Transaction[]; // from game-board

  transactionForm = new FormGroup({
    fromPlayerName: new FormControl(''),
    toPlayerName: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(
    private logger: DialogService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {}
  handleTransaction(transaction: Transaction): void {
    this.logger.log(
      'Transaction from ' +
        transaction.fromPlayer.name +
        ' to ' +
        transaction.toPlayer.name +
        ' in the amount of ' +
        transaction.amount
    );

    // the bank has unlimited money
    if (
      transaction.fromPlayer.name != 'Bank' &&
      transaction.fromPlayer.money < transaction.amount
    ) {
      this.logger.displayErrorDialog(
        'Not enough money. Must raise $' +
          (transaction.amount - transaction.fromPlayer.money) +
          '.'
      );
      return;
    }

    this.transactionService.doTransaction(transaction);

    transaction.fromPlayer.money -= transaction.amount;
    transaction.toPlayer.money += transaction.amount;
  }
  makePayment(): void {
    this.logger.log('Handling transaction');
    if (!this.players) {
      this.logger.displayErrorDialog('No players available!');
      return;
    }

    if (
      this.transactionForm.controls.fromPlayerName.value ==
      this.transactionForm.controls.toPlayerName.value
    ) {
      this.logger.displayErrorDialog('Cannot pay yourself!');
      return;
    }

    let toPlayer: Player | null = this.findPlayerByName(
      this.transactionForm.controls.toPlayerName.value
    );
    let fromPlayer: Player | null = this.findPlayerByName(
      this.transactionForm.controls.fromPlayerName.value
    );
    if (!toPlayer || !fromPlayer) {
      this.logger.displayErrorDialog('Unable to find to and from player!');
      return;
    }

    let t: Transaction = {
      timestamp: new Date().toISOString(),
      fromPlayer: fromPlayer,
      toPlayer: toPlayer,
      amount: this.transactionForm.controls.amount.value,
    };
    this.handleTransaction(t);
  }

  findPlayerByName(name: string): Player | null {
    if (!this.players) {
      return null;
    }

    for (let p of this.players) {
      if (p.name == name) {
        return p;
      }
    }
    return null;
  }
}
