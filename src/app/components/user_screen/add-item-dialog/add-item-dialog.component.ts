import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditMenuService } from 'src/app/edit-menu.service';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) private data,private _fb: FormBuilder, private _dialogRef: DialogRef,
    private _editMenuService: EditMenuService){}

  addItemForm = this._fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    isVeg: ['', Validators.required]
  })
  addItem(){
    console.log('Adding this item: ', this.addItemForm.value)
    let body = {
      "restaurant_id": this.data.restaurant_id,
      "name": this.addItemForm.value.name,
      "price": this.addItemForm.value.price,
      "category_id": this.data.category.id,
      "veg": this.addItemForm.value.isVeg == 'veg'? true: false,
      "non_veg": this.addItemForm.value.isVeg == 'non_veg'? true: false,
      "egg": this.addItemForm.value.isVeg == 'egg'? true: false,
    }
    this._editMenuService.addItem(body).subscribe(
      data => {
        console.log(data)
        this._dialogRef.close({success: true})},
      error => {
        console.log(error);
        this._dialogRef.close({success: false})
      }
    )
    
  }

  close(){
    this._dialogRef.close({success: false})
  }
}
