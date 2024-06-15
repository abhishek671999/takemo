import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-subitem-dialog',
  templateUrl: './select-subitem-dialog.component.html',
  styleUrls: ['./select-subitem-dialog.component.css']
})
export class SelectSubitemDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<SelectSubitemDialogComponent>,
  ) { }
  restaurantParcel;
  amountAdded = 0

  ngOnInit() {
    console.log(this.data)
    this.dialogRef.disableClose = true
    this.restaurantParcel = this.data.restaurantParcel
    this.data.item.item_unit_price_list.forEach(ele => {
      if (!ele.quantity) {
        ele['quantity'] = 0
      }
    })
  }

  addSubItem(subItem) {
    subItem.quantity += 1
    this.amountAdded += subItem.price
  }

  subSubItem(subItem) {
    if (subItem.quantity < 0) {
      subItem.quantity -= 1
      this.amountAdded -= subItem.price
    }
  }

  subParcelSubItem(subItem) {
    
  }

  addParcelSubItem(subItem) {
    
  }

  incrementParcelQuantity(subItem) {
    
  }

  calculateItemAmount(subItem) {
    
  }
  clearItem(subItem) {
    
  }

  closeWindow() {
    console.log('called')
    this.dialogRef.close({amount: this.amountAdded})
  }
}
