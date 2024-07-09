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
    this.data.addfn(subItem, this.data.item)
  }

  subSubItem(subItem) {
    this.data.subfn(subItem, this.data.item)
  }

  subParcelSubItem(subItem) {
    
  }

  addParcelSubItem(subItem) {
    
  }

  incrementParcelQuantity(subItem) {
    
  }

  calculateItemAmount(subItem) {
    console.log(subItem)
    return subItem.price * (subItem.quantity)
  }

  clearItem(subItem) {
    this.data.clearfn(subItem, this.data.item)
  }

  closeWindow() {
    this.dialogRef.close({amount: this.amountAdded})
  }
}
