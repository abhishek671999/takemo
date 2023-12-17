import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-msg-dialog',
  templateUrl: './success-msg-dialog.component.html',
  styleUrls: ['./success-msg-dialog.component.css']
})
export class SuccessMsgDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data, private _matDialogRef: MatDialogRef<SuccessMsgDialogComponent>){}

  ngOnInit(){
    setTimeout(() => {
      this._matDialogRef.close()
    }, 5000);
  }
}
