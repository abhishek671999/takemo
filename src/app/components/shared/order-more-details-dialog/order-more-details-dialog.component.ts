import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-more-details-dialog',
  templateUrl: './order-more-details-dialog.component.html',
  styleUrls: ['./order-more-details-dialog.component.css'],
  
})
export class OrderMoreDetailsDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<OrderMoreDetailsDialogComponent>
  ){}
  NA = 'NA'
  closeDialog(){
    this.dialogRef.close()
  }

}
