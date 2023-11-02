import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css'],
})
export class AddCategoryDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    private _editMenuService: EditMenuService
  ) {}

  addCategoryForm = this._fb.group({
    categoryName: ['', [Validators.required]],
    itemName: ['', Validators.required],
    price: ['', Validators.required],
    isVeg: ['', Validators.required],
  });

  addCategory() {
    console.log(this.addCategoryForm.value);
    let body = {
      restaurant_id: this.data.restaurant_id,
      category: this.addCategoryForm.value.categoryName,
    };
    console.log('This is body: ', body);
    this._editMenuService.addCategory(body).subscribe(
      (data) => {
        console.log('Added component: ', data);
        let body = {
          category_id: data['id'],
          name: this.addCategoryForm.value.itemName,
          price: this.addCategoryForm.value.price,
          veg: this.addCategoryForm.value.isVeg == 'veg' ? true : false,
          non_veg: this.addCategoryForm.value.isVeg == 'non_veg' ? true : false,
          egg: this.addCategoryForm.value.isVeg == 'egg' ? true : false,
        };
        this._editMenuService.addItem(body).subscribe(
          (data) => {
            console.log('Added item', data);
            this._dialogRef.close({ success: 'ok' });
          },
          (error) => {
            console.log(error);
            this._dialogRef.close({ success: 'failed' });
          }
        );
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
