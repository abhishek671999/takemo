import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, switchMap } from 'rxjs';
import { ImagesService } from 'src/app/shared/services/images/images.service';
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
    private _editMenuService: EditMenuService,
    private __imageService: ImagesService,
  ) {}

  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;
  file: File;

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
    this._editMenuService.addItem(body).pipe(
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
        this.dialogRef.close({ sucess: 'ok' })
      },
      error => {
        console.log('error', error)
      }
    )

    // this._editMenuService.addItem(body).subscribe(
    //   (data) => {
    //     console.log('Added ', data);
    //     this.dialogRef.close({ success: 'ok' });
    //   },
    //   (error) => {
    //     this.dialogRef.close({ success: 'failed', errorMsg: error.error.description });
    //   }
    // );
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event);
    }
  }

  onFileSelected(event: any) {
    this.outputBoxVisible = false;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;
    this.file = event.dataTransfer?.files[0] || event.target?.files[0];
  }

  close() {
    this.dialogRef.close();
  }
}
