import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditMenuService } from 'src/app/edit-menu.service';

@Component({
  selector: 'app-edit-form-dialog',
  templateUrl: './edit-form-dialog.component.html',
  styleUrls: ['./edit-form-dialog.component.css']
})
export class EditFormDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public item, 
  public dialogRef: MatDialogRef<EditFormDialogComponent>,
  public _fb: FormBuilder,
  private _editMenuService: EditMenuService){}

  editMenuForm = this._fb.group({
    id: this.item.id,
    name: this.item.name,
    price: this.item.price,
    isVeg: this.item.veg
  })
  
  editSubmit(){
    console.log('Form submitted', this.editMenuForm.value)
    let body = {
      "item_id": this.editMenuForm.value.id,
      "name": this.editMenuForm.value.name,
      "price": this.editMenuForm.value.price,
      'veg': this.editMenuForm.value.isVeg == 'veg'? true: false,
      'non_veg': this.editMenuForm.value.isVeg == 'non_veg'? true: false,
      'egg': this.editMenuForm.value.isVeg == 'egg'? true: false
  }
    this._editMenuService.editMenu(body).subscribe(
      data => {
        console.log('Successful message from editmenu', data),
        this.dialogRef.close({success: 'ok'})},
      error => {
        console.log('Error while updating', error),
        this.dialogRef.close({success: 'failed'})
      }
    )
  }

  close(){
    this.dialogRef.close({success: null})
  }
}
