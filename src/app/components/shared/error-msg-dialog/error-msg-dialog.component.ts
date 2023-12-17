import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-msg-dialog',
  templateUrl: './error-msg-dialog.component.html',
  styleUrls: ['./error-msg-dialog.component.css']
})
export class ErrorMsgDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data, private _matDialogRef: MatDialogRef<ErrorMsgDialogComponent>){}

  ngOnInit(){
    setTimeout(() => {
      this._matDialogRef.close()
    }, 10000);
  }

}
