import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, switchMap } from 'rxjs';
import { ImagesService } from 'src/app/shared/services/images/images.service';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';

@Component({
  selector: 'app-edit-form-dialog',
  templateUrl: './edit-form-dialog.component.html',
  styleUrls: ['./edit-form-dialog.component.css'],
})
export class EditFormDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditFormDialogComponent>,
    public _fb: FormBuilder,
    private _editMenuService: EditMenuService,
    private __imageService: ImagesService
  ) { }

  
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;
  file: File;
  
  ngOnInit() {
    console.log(this.data)
  }

  editMenuForm = this._fb.group({
    id: [this.data.id, Validators.required],
    name: [this.data.name, Validators.required],
    price: [this.data.price, Validators.required],
    isVeg: [this.data.veg ? 'veg' : this.data.non_veg ? 'non_veg' : 'egg', Validators.required],
    mrp_price: [this.data.mrp_price, Validators.required],
    item_description: [this.data.item_description],
    counter_id: [this.data.counter.counter_id],
    
  });

  editSubmit() {
    console.log('Form submitted', this.editMenuForm.value);
    let body = {
      item_id: this.editMenuForm.value.id,
      name: this.editMenuForm.value.name,
      price: this.editMenuForm.value.price,
      veg: this.editMenuForm.value.isVeg == 'veg' ? true : false,
      non_veg: this.editMenuForm.value.isVeg == 'non_veg' ? true : false,
      egg: this.editMenuForm.value.isVeg == 'egg' ? true : false,
      mrp_price: this.editMenuForm.value.mrp_price,
      item_description: this.editMenuForm.value.item_description,
      counter_id: this.editMenuForm.value.counter_id
    };
    this._editMenuService.editMenu(body).pipe(
      switchMap(response => {
        console.log('this is response', response)
        if (this.file && response['created']) {
          this.fileName = this.file.name;
          this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
          this.outputBoxVisible = true;
    
          const formData = new FormData();
          formData.append('file', this.file);
          formData.append('item_id', response['item_id']);
    
          return this.__imageService.uploadImage(formData)
        } else if (response['created']){
          this.dialogRef.close({ sucess: 'ok' })
          return of(null)
        } else {
          return of(null)
        }
      })
    ).subscribe(
      (data) => {
          console.log('Successful message from editmenu', data),
          this.dialogRef.close({ success: 'ok' });
      },
      (error) => {
        console.log('Error while updating', error),
          this.dialogRef.close({ success: 'failed',  errorMsg: error.error.description });
      }
    );
  }

  close() {
    this.dialogRef.close({ success: null });
  }
}
