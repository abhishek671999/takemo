import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { of, switchMap } from 'rxjs';
import { svgDeleteIcon } from 'src/app/shared/icons/svg-icons';
import { ImagesService } from 'src/app/shared/services/images/images.service';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';
import { sessionWrapper } from 'src/app/shared/site-variable';

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
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private __sessionWrapper: sessionWrapper
  ) {

    this.matIconRegistry.addSvgIconLiteral(
      'plus',
      this.domSanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,300,150">
        <g fill="#ff0000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M15,3c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12zM21,16h-5v5c0,0.553 -0.448,1 -1,1c-0.552,0 -1,-0.447 -1,-1v-5h-5c-0.552,0 -1,-0.447 -1,-1c0,-0.553 0.448,-1 1,-1h5v-5c0,-0.553 0.448,-1 1,-1c0.552,0 1,0.447 1,1v5h5c0.552,0 1,0.447 1,1c0,0.553 -0.448,1 -1,1z"></path></g></g>
        </svg>`
      )
    );

    this.matIconRegistry.addSvgIconLiteral(
      'delete',
      this.domSanitizer.bypassSecurityTrustHtml(svgDeleteIcon)
    );
   }
   private restaurantType = this.__sessionWrapper.getItem('restaurantType')?.toLowerCase()


  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;
  file: File;

  acceptedUnits = ['Piece', 'Grams', 'Litre']
  unitsSubUnitsMapping = {
    '1': [],
    '2': ['g', 'kg'],
    '3': ['ml', 'l']
  }
  unitQuantityPriceObj = {
    unit: null,
    quantity: null,
    price: null,
    mrp_price: null
  }
  selectedUnit = ''
  
  unitPriceDetails = []

  addItemForm = this._fb.group({
    name: ['', Validators.required],
    price: [0],
    mrpPrice: [0],
    isVeg: ['veg', Validators.required],
    counterId: [''],
    itemUnit: ['1', Validators.required],
    item_description: [''],
    subItemUnit: ['']
  });

  addItem() {
    let body = {
      restaurant_id: this.data.restaurant_id,
      name: this.addItemForm.value.name,
      price: this.addItemForm.value.price,
      mrp_price: this.addItemForm.value.mrpPrice,
      category_id: this.data.categoryId,
      veg: this.addItemForm.value.isVeg == 'veg' ? true : false,
      non_veg: this.addItemForm.value.isVeg == 'non_veg' ? true : false,
      egg: this.addItemForm.value.isVeg == 'egg' ? true : false,
      counter_id: this.addItemForm.value.counterId,
      item_unit: this.addItemForm.value.itemUnit,
      item_unit_price_list: this.unitPriceDetails
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
          this.dialogRef.close({ success: 'ok' })
          return of(null)
        } else {
          return of(null)
        }
      })
    ).subscribe(
      (data) => {
        this.dialogRef.close({ success: 'ok' })
      },
      error => {
        console.log('error', error)
      }
    )
  }

  getSubUnits() {
    return this.unitsSubUnitsMapping[this.addItemForm.value.itemUnit]
  }
  addUnitPriceDetails() {

    this.unitPriceDetails.push({
      'quantity': this.unitQuantityPriceObj.quantity,
      'price': this.unitQuantityPriceObj.price,
      'unit': this.addItemForm.value.subItemUnit,
      "mrp_price": this.unitQuantityPriceObj.mrp_price,
      "is_available": true
    })
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

  showSubUnitSection() {
    return this.addItemForm.value.itemUnit != '1'
  }

  isTypeEcom() {
    return this.restaurantType == 'e-commerce'
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
