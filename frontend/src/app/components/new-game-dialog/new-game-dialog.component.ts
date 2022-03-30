import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface NewGameDialogData {}

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.css'],
})
export class NewGameDialogComponent implements OnInit {
  newGameForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<NewGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewGameDialogData
  ) {
    dialogRef
      .beforeClosed()
      .subscribe(() => dialogRef.close(this.newGameForm.controls.name.value));
  }
  ngOnInit(): void {}
  getErrorMessage() {
    if (this.newGameForm.controls.name.hasError('required')) {
      return 'You must enter a value';
    }

    return this.newGameForm.controls.name.hasError('name')
      ? 'Not a valid email'
      : '';
  }

  onOkClick(): void {
    this.dialogRef.close();
  }
}
