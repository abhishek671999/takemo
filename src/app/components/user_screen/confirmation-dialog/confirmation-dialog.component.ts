import {Component, Inject} from '@angular/core'
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],

})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public pickedItems, public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
  }

  onEditButtonClick(){
    this.dialogRef.close(false)
  }
  onConfirmButtonClick(){
    this.dialogRef.close(true)
  }

}
