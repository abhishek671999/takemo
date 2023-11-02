import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';

@Component({
  selector: 'app-delete-category-confirmation-dialog',
  templateUrl: './delete-category-confirmation-dialog.component.html',
  styleUrls: ['./delete-category-confirmation-dialog.component.css'],
})
export class DeleteCategoryConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public category,
    private _editMenuService: EditMenuService,
    private _dialogRef: MatDialogRef<DeleteCategoryConfirmationDialogComponent>
  ) {}

  deleteCategory() {
    console.log('This is category: ', this.category);
    let body = {
      category_id: this.category.category.id,
    };
    this._editMenuService.deleteCategory(body).subscribe(
      (data) => {
        console.log(data);
        this._dialogRef.close({ success: 'ok' });
      },
      (error) => {
        console.log(error);
        this._dialogRef.close({ success: 'failed' });
      }
    );
  }

  close() {
    this._dialogRef.close();
  }
}
