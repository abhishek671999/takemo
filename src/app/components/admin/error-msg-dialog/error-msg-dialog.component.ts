import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-msg-dialog',
  templateUrl: './error-msg-dialog.component.html',
  styleUrls: ['./error-msg-dialog.component.css']
})
export class ErrorMsgDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data){}

}
