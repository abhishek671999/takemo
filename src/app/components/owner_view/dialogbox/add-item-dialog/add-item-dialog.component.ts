import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css'],
})
export class AddItemDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    private _editMenuService: EditMenuService
  ) {}

  addItemForm = this._fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    isVeg: ['veg', Validators.required],
    counterId: ['']
  });
  addItem() {
    console.log('Adding this item: ', this.addItemForm.value);
    let body = {
      restaurant_id: this.data.restaurant_id,
      name: this.addItemForm.value.name,
      price: this.addItemForm.value.price,
      category_id: this.data.category.id,
      veg: this.addItemForm.value.isVeg == 'veg' ? true : false,
      non_veg: this.addItemForm.value.isVeg == 'non_veg' ? true : false,
      egg: this.addItemForm.value.isVeg == 'egg' ? true : false,
      counter_id: this.addItemForm.value.counterId
    };
    this._editMenuService.addItem(body).subscribe(
      (data) => {
        console.log('Added ', data);
        this.dialogRef.close({ success: 'ok' });
      },
      (error) => {
        this.dialogRef.close({ success: 'failed', errorMsg: error.error.description });
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
