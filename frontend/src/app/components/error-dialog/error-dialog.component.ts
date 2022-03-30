import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ErrorDialogData {
  errorMsg: string;
}

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
})
export class ErrorDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {}

  ngOnInit(): void {}
  onOkClick(): void {
    this.dialogRef.close();
  }
}
