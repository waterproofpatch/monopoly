import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Player, Transaction } from '../types';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent implements OnInit {
  @Input() player?: Player;
  @Input() players?: Player[]; // from players
  @Output() gameState = new EventEmitter<Transaction>();

  transactionForm = new FormGroup({
    otherPlayer: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(private logger: DialogService) {}

  ngOnInit(): void {}

  openPieceSelectDialog(): void {
    if (!this.player) {
      this.logger.displayErrorDialog('Player is not set!');
      return;
    }
    this.logger.displayPieceSelectDialog(this.player);
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
  makePayment(): void {
    this.logger.log('Handling transaction');
    if (!this.players || !this.player) {
      this.logger.displayErrorDialog('No players available!');
      return;
    }

    if (this.transactionForm.controls.otherPlayer.value == this.player.name) {
      this.logger.displayErrorDialog('Cannot pay yourself!');
      return;
    }

    let otherPlayer: Player | null = this.findPlayerByName(
      this.transactionForm.controls.otherPlayer.value
    );
    if (!otherPlayer) {
      this.logger.displayErrorDialog(
        "No player by name of '" +
          this.transactionForm.controls.otherPlayer.value +
          "'"
      );
      return;
    }

    let t: Transaction = {
      timestamp: new Date().toISOString(),
      fromPlayer: this.player,
      toPlayer: otherPlayer,
      amount: this.transactionForm.controls.amount.value,
    };
    this.handleTransaction(t);
    this.transactionForm.reset();
  }

  otherPlayers(): Player[] {
    if (!this.players || !this.player) {
      this.logger.displayErrorDialog('Players is not set!');
      return [];
    }

    let retPlayers: Player[] = [];

    for (let otherPlayer of this.players) {
      if (otherPlayer.name != this.player.name) {
        retPlayers.push(otherPlayer);
      }
    }
    return retPlayers;
  }

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

    this.gameState.emit(transaction);

    transaction.fromPlayer.money -= transaction.amount;
    transaction.toPlayer.money += transaction.amount;
  }
}
