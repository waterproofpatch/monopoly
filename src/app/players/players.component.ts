import {
  Component,
  Inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Player, Transaction } from '../player';
import { LogService } from '../log-service.service';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  errorMsg: string;
}

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  @Input() transactions?: Transaction[]; // from game-board
  @Output() gameState = new EventEmitter<Transaction>();

  transactionForm = new FormGroup({
    otherPlayer: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(private logger: LogService, private dialog: MatDialog) {}

  openDialog(errorMsg: string): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { errorMsg: errorMsg },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit(): void {}

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
      this.openDialog(
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

  makePayment(player: Player): void {
    this.logger.log('Handling transaction');
    if (!this.players) {
      this.openDialog('No players available!');
      return;
    }

    if (this.transactionForm.controls.otherPlayer.value == player.name) {
      this.openDialog('Cannot pay yourself!');
      return;
    }

    let otherPlayer: Player | null = this.findPlayerByName(
      this.transactionForm.controls.otherPlayer.value
    );
    if (!otherPlayer) {
      this.openDialog(
        "No player by name of '" +
          this.transactionForm.controls.otherPlayer.value +
          "'"
      );
      return;
    }

    let t: Transaction = {
      fromPlayer: player,
      toPlayer: otherPlayer,
      amount: this.transactionForm.controls.amount.value,
    };
    this.handleTransaction(t);
    this.transactionForm.reset();
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
}
