import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-parcel-dialog',
  templateUrl: './parcel-dialog.component.html',
  styleUrls: ['./parcel-dialog.component.css']
})
export class ParcelDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matdialogRef: MatDialogRef<ParcelDialogComponent>

  ){
    console.log(data)
    this.itemCopy = JSON.parse(JSON.stringify(data.item))
    
  }

  public itemCopy;
  public parcelCharges = 5 //hardcode

  public availableDeliveryMode =[ 
    {name: 'Dine in', value: 1},
    {name: 'take away', value: 2}
  ]


  addItem(event, selectedDeliveryMode){
    event.stopPropagation()
    if(selectedDeliveryMode == 1){
      this.itemCopy.quantity += 1
    }else if(selectedDeliveryMode == 2){
      this.itemCopy.parcel_quantity += 1
      this.itemCopy.quantity += 1
    }

  }

  subItem(event, selectedDeliveryMode){
    event.stopPropagation()
    if(this.itemCopy.quantity > 0){
      if(selectedDeliveryMode == 1){
        this.itemCopy.quantity -= 1
      }else if(selectedDeliveryMode == 2){
        this.itemCopy.parcel_quantity -= 1
        this.itemCopy.quantity -= 1
      }
    }
  }

  submit(){
    this.data.orderList.parcel_amount += (this.itemCopy.parcel_quantity - this.data.item.parcel_quantity) * 5 //hardcode
    this.data.orderList.amount += (this.itemCopy.quantity - this.data.item.quantity) * this.itemCopy.price
    let itemAdded = this.data.orderList.itemList.find((x) => x.id == this.itemCopy.id)
    if(!itemAdded) this.data.orderList.itemList.push(this.data.item)
    this.data.item.quantity = this.itemCopy.quantity
    this.data.item.parcel_quantity = this.itemCopy.parcel_quantity
    this.matdialogRef.close({result: true})
  }

  close(){
    this.matdialogRef.close()
  }




}
