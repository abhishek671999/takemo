import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-successful-dialog',
  templateUrl: './successful-dialog.component.html',
  styleUrls: ['./successful-dialog.component.css']
})
export class SuccessfulDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data){}

}
