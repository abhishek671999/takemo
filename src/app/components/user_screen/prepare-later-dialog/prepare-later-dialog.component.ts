import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prepare-later-dialog',
  templateUrl: './prepare-later-dialog.component.html',
  styleUrls: ['./prepare-later-dialog.component.css']
})
export class PrepareLaterDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matdialogRef: MatDialogRef<PrepareLaterDialogComponent>
  ) { 
    console.log('This is data: ', data);
    this.itemList = data.summary.itemList
    this.itemList.forEach(item => {
      item.total_quantity = item.quantity      
    });
  }

  itemList: any = []


  orderAfterNMinutes(selectedItem, index, order_after, event){
    console.log(selectedItem, index, order_after, event)
    if(event.selected){
      selectedItem['order_after'] = order_after 
      // if(selectedItem.quantity > 0){
      //   selectedItem.quantity -= 1
      //   let newItem = JSON.parse(JSON.stringify(selectedItem))
      //   let existingItem = this.itemList.filter((item, i) =>  item.id == newItem.id && item.order_after == order_after)
      //   if(existingItem.length > 0){
      //     existingItem[0].quantity += 1
      //   } else{
      //     newItem.quantity = 1
      //     newItem['order_after'] = order_after
      //     this.itemList.splice(index+1, 0, newItem)
      //   }
      // }else{
      //   console.log('No item to remove')
      //    event.source.selected = false
      // }
    }else{
      selectedItem['order_after'] = undefined
      // let existingItem = this.itemList.filter((item, i) =>  item.id == selectedItem.id && item.order_after == order_after)
      // if(existingItem.length > 0){
      //   selectedItem.quantity += existingItem[0].quantity
      //   existingItem[0].quantity = 0
      // } 
      // this.removeZeroQuantityItems()
    }
  } 

  removeZeroQuantityItems(){
    this.itemList = this.itemList.filter((item, i) => item.quantity > 0 || item.order_after == undefined)
  }

  onPrepareLater() {
    this.data.summary.itemList = this.itemList
    console.log( this.itemList.some(item => item.order_after != undefined))
    this.matdialogRef.close({update:  this.itemList.some(item => item.order_after != undefined)});
  }

  subItem(event){

  }

  addItem(selectedItem){
    let existingItem = this.itemList.filter((item, i) =>  item.id == selectedItem.id && item.order_after == undefined)
    if(existingItem.length > 0){
      if(existingItem[0].quantity > 0){
        existingItem[0].quantity -= 1
        selectedItem.quantity += 1
      }else{
        console.log('No item to remove')
      }
    } 
  }

}
