import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Player, Transaction } from '../player';
import { LogService } from '../log-service.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  @Output() gameState = new EventEmitter<Transaction>();
  selectedPlayer?: Player;
  errorMsg: string = '';

  constructor(private logger: LogService) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    this.errorMsg = '';
  }

  onSelect(player: Player): void {
    this.errorMsg = '';
    this.selectedPlayer = player;
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

    this.errorMsg = '';

    // the bank has unlimited money
    if (
      transaction.fromPlayer.name != 'Bank' &&
      transaction.fromPlayer.money < transaction.amount
    ) {
      this.errorMsg = 'Not enough money!';
      return;
    }

    this.gameState.emit(transaction);

    transaction.fromPlayer.money -= transaction.amount;
    transaction.toPlayer.money += transaction.amount;

    // store the transaction in each player
    transaction.fromPlayer.transactions.push(transaction);
    transaction.toPlayer.transactions.push(transaction);
  }
}
