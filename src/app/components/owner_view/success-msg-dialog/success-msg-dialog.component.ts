import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-msg-dialog',
  templateUrl: './success-msg-dialog.component.html',
  styleUrls: ['./success-msg-dialog.component.css']
})
export class SuccessMsgDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data){}

}
