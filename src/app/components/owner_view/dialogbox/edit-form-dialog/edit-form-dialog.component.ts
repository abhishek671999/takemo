import { Component, Inject } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, switchMap } from 'rxjs';
import { ImagesService } from 'src/app/shared/services/images/images.service';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';
import { meAPIUtility } from 'src/app/shared/site-variable';


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
    private __imageService: ImagesService,
    private meUtility: meAPIUtility
  ) { 
    console.log('this is data: ', data)
  }

  public inventoryManagement: boolean
  public counterMangement: boolean
  private restaurantType: string
  public mobileOrderingEnabled: boolean
  public taxInclusive: boolean

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
    option: null,
    price: null,
    mrp_price: null
  }
  unitPriceDetails = []
  itemUnitPreviousValue = null
  tableManagement: boolean = false

  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.tableManagement = restaurant['table_management']
        this.inventoryManagement = restaurant['inventory_management']
        this.counterMangement = restaurant['counter_management']
        this.restaurantType = restaurant['type'].toLowerCase()
        this.mobileOrderingEnabled = restaurant['mobile_ordering']
        this.taxInclusive = restaurant['tax_inclusive']
      }
    )
    this.unitPriceDetails = this.data.item_unit_price_list
    this.editMenuForm.get('itemUnit').valueChanges.subscribe(newValue => { // todo: maintain previous state
      this.itemUnitPreviousValue = this.editMenuForm.get('itemUnit').value;
    });
  }
  private readonly counterValidator: ValidatorFn = c => {
    return  this.tableManagement ? Validators.required(c) : Validators.nullValidator(c);
  }

  editMenuForm = this._fb.group({
    id: [this.data.id, Validators.required],
    name: [this.data.name, Validators.required],
    price: [this.data.price],
    mrpPrice: [this.data.mrp_price],
    makingPrice: [this.data.making_price],
    isVeg: [this.data.veg ? 'veg' : this.data.non_veg ? 'non_veg' : 'egg', Validators.required],
    counterId: [this.data.counter.counter_id, this.counterValidator],
    itemUnit: [{'Piece': '1', 'Grams': '2', 'Litre': '3'}[this.data.item_unit], Validators.required],
    itemDescription: [this.data.item_description],
    subItemUnit: [''],
    inventory_stock: [this.data.inventory_stock],
    tax_inclusive: [!this.data.tax_inclusive]
  });


  editMenu() {
    let body = {
      item_id: this.editMenuForm.value.id,
      name: this.editMenuForm.value.name,
      price: this.editMenuForm.value.price,
      making_price: Number(this.editMenuForm.value.makingPrice),
      veg: this.editMenuForm.value.isVeg == 'veg' ? true : false,
      non_veg: this.editMenuForm.value.isVeg == 'non_veg' ? true : false,
      egg: this.editMenuForm.value.isVeg == 'egg' ? true : false,
      mrp_price: this.editMenuForm.value.mrpPrice,
      item_description: this.editMenuForm.value.itemDescription,
      counter_id: this.editMenuForm.value.counterId,
      item_unit: Number(this.editMenuForm.value.itemUnit),
      inventory_stock: this.editMenuForm.value.inventory_stock,
      tax_inclusive: !this.editMenuForm.value.tax_inclusive // checkbox indicates tax exclusive
      // item_unit_price_list: this.unitPriceDetails
    };
    return this._editMenuService.editMenu(body)
  }

  updateUnit() {
    console.log(this.editMenuForm)
    this.editMenu().subscribe(
      data => {
        this.editMenuForm.value.itemUnit = this.itemUnitPreviousValue
      },
      error => { 
        alert('Failed to update unit')
        console.log(this.editMenuForm)
        this.editMenuForm.value.itemUnit = this.itemUnitPreviousValue
      }
    )
  }

  editSubmit() {
    this.editMenu().pipe(
      switchMap(response => {
        console.log('this is response', response)
        if (this.file && response['updated']) {
          this.fileName = this.file.name;
          this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
          this.outputBoxVisible = true;
    
          const formData = new FormData();
          formData.append('file', this.file);
          formData.append('item_id', this.editMenuForm.value.id);
    
          return this.__imageService.uploadImage(formData)
        } else if (response['updated']){
          return of(response)
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
    this.dialogRef.close({ success: null });
  }

  showSubUnitSection() {
    return !(this.editMenuForm.value.itemUnit == '1' || this.editMenuForm.value.itemUnit.toLowerCase() == 'piece' || this.restaurantType == 'restaurant')
  }

  isTypeEcom() {
    return this.restaurantType == 'e-commerce'
  }

  getSubUnits() {
    console.log(this.editMenuForm.value.itemUnit)
    return this.unitsSubUnitsMapping[this.editMenuForm.value.itemUnit]
  }

  addUnitPriceDetails() {
    let body = {
      "item_id": this.data.id,
      'price': this.unitQuantityPriceObj.price,
      'unit': this.unitQuantityPriceObj.option + ' ' +  this.unitQuantityPriceObj.unit,
      "mrp_price": this.unitQuantityPriceObj.mrp_price,
      "is_available": true
    }
    this._editMenuService.addItemUnitPrice(body).subscribe(
      data => {
        this.unitPriceDetails.push(body)
      },
      error => {
        alert('Add failed')
      }
    )
  }

  deleteSubItem(subItem) {
    let body = {
      "item_unit_price_id": subItem.item_unit_price_id
    }
    console.log(body)
    this._editMenuService.deleteSubItem(body).subscribe(
      data => {
        this.unitPriceDetails = this.unitPriceDetails.filter(ele => ele.item_unit_price_id != subItem.item_unit_price_id)
      },
      error => {
        alert('Failed to delete')
      }
    )
  }


}
