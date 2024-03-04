import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.css']
})
export class ConfirmActionDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialogRef: MatDialogRef<ConfirmActionDialogComponent>,
  ){}

  closeDialog(){
    this._dialogRef.close({select: false})
  }

  accept(){
    this._dialogRef.close({select: true })
  }

}
