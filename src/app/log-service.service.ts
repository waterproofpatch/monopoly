import { Inject, Component, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  errorMsg: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private dialog: MatDialog) {}
  log(msg: any) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }

  displayErrorDialog(errorMsg: string): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { errorMsg: errorMsg },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './error-dialog.html',
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
