import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuService } from 'src/app/menu.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  
  amount: number = 0;
  orderList = {items: [], amount: 0}
  constructor(private _menuService: MenuService, private _route: ActivatedRoute, private _router: Router, 
    private _dialog: MatDialog){}
  
  menu_response:any
  showSpinner = true
  
  ngOnInit(){
    this.showSpinner = true
    this._route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get('id'))
      this._menuService.getMenu(id).subscribe(
        data => {
          this.menu_response = data,
          console.log('This is data: ', data)
          console.log('This is menue response: ', this.menu_response)
          this.setQuantity()
          console.log('After setting quantity: ', this.menu_response)
        },
        error => console.log('Error while getting menu: ', error)
      )
    })
    
    this.showSpinner= false
  }

  setQuantity(){
    console.log('Setting quantity:', this.menu_response)
    this.menu_response.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        item.quantity = 0;
      })
    })
  }

  addItem(item){
    if(item.quantity < 3){
      item.quantity += 1
      this.amount += item.price
    }
    
  }
  subItem(item){
    if(item.quantity > 0){
      item.quantity -= 1
      this.amount -= item.price
    }
  }

  prepareSummary(){
    this.menu_response.menu.forEach(category => {
      category.category.items.forEach(item => {
        if(item.quantity){
          let itemSummary = {
            'name': item.name, 
            'quantity': item.quantity,
            'price': item.price
          }
          this.orderList.items.push(itemSummary)
        }
      });
    });
    this.orderList.amount = this.amount
    console.log(this.orderList)
    // this._menuService.submitOrder(this.orderList)
    let dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: this.orderList
    }
    )
    dialogRef.afterClosed().subscribe( result =>{
      console.log('Result from dialog component: ', result)
      if(result){
        console.log('Call place order api here');
      }else{
        this.orderList = {items: [], amount: 0}
      }
    }
      

    )
  }

}
