import { Inject, Component, Injectable } from '@angular/core';
import { Player } from './types';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface ErrorDialogData {
  errorMsg: string;
}
export interface PieceSelectDialogData {
  player: Player;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}
  log(msg: any) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }

  displayPieceSelectDialog(player: Player) {
    const dialogRef = this.dialog.open(PieceSelectDialog, {
      width: '250px',
      data: { player: player },
    });
  }
  displayErrorDialog(errorMsg: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      width: '250px',
      data: { errorMsg: errorMsg },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.html',
})
export class ErrorDialog {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'piece-select-dialog',
  templateUrl: './piece-select-dialog.html',
})
export class PieceSelectDialog {
  constructor(
    public dialogRef: MatDialogRef<PieceSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PieceSelectDialogData
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
}
