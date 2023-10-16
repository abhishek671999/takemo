import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuService } from 'src/app/menu.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  
  amount: number = 0;
  orderList = []
  constructor(private _menuService: MenuService, private _route: ActivatedRoute, private _router: Router){}
  
  menu_response:any
  showspineer = true
  
  ngOnInit(){
    this._route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get('id'))
      this.menu_response = this._menuService.getMenu(id)
    })
    console.log(this.menu_response)
    this.setQuantity()
    console.log(this.menu_response)
  }

  setQuantity(){
    this.menu_response.forEach( (category) => {
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
    this.orderList = []
    this.menu_response.forEach(category => {
      category.category.items.forEach(item => {
        if(item.quantity){
          let itemSummary = {
            'name': item.name, 
            'quantity': item.quantity,
            'price': item.price
          }
          this.orderList.push(itemSummary)
        }
      });
    });
    this.orderList.push({amount: this.amount})
    console.log(this.orderList)
    this._menuService.submitOrder(this.orderList)
  }

}
