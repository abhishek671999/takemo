import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css'],
})
export class DeleteConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public item,
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    private _editMenuService: EditMenuService
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    console.log('Deleting this item: ', this.item);
    let body = {
      item_id: this.item.id,
    };
    console.log('This is body: ', body);
    this._editMenuService.deleteItem(body).subscribe(
      (data) => console.log(data),
      (error) => console.log(error)
    );
    this.dialogRef.close({ success: 'ok' });
  }
}
