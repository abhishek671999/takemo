import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  amount: number = 0;
  orderList = { items: [], amount: 0, restaurant_id: null };
  constructor(
    private _menuService: MenuService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _orderService: OrdersService
  ) {}
  

  public menu;
  showSpinner = true;
  restaurant_id: number;
  public summary;


  ngOnInit() {
    this.showSpinner = true;
    this.summary = {
      amount: 0,
      itemList: []
    }
    this._route.paramMap.subscribe((params: ParamMap) => {
      this.restaurant_id = parseInt(params.get('id'));
      this._menuService.getMenu(this.restaurant_id).subscribe(
        (data) => {
          this.menu = data['menu'];
        this.menu.map((category) => {
          category.category.items.filter(
            (element) => element.is_available == true
          );
        });
        this.setQuantity();
        this.showOnlyFirstCategory()
        this.showSpinner = false;
        },
        (error) => {
          console.log('Error while getting menu: ', error)
          this.showSpinner = false;
          alert('Error while loading menu')
        }
      );
    });
  }

  setQuantity() {
    console.log('Setting quantity:', this.menu);
    this.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        item.quantity = 0;
      });
    });
  }

  showOnlyFirstCategory(){
    setTimeout(() => {
      console.log('trying to show only first element')
    let allCategoryBlock = Array.from(document.getElementsByClassName('category-wrapper') as HTMLCollectionOf<HTMLElement>)
    allCategoryBlock.forEach( (ele, index) => {
      if(index == 0){
        ele.classList.add('show')
        ele.classList.remove('hidden')
      }else{
        ele.classList.remove('show')
        ele.classList.add('hidden')
      }
    }
    )

    let allCategoryBar = Array.from(document.getElementsByClassName('category-bar-items') as HTMLCollectionOf<HTMLElement>)
    allCategoryBar.forEach( (ele, index) => {
      if(index == 0){
        ele.classList.add('active')
      }else{
        ele.classList.remove('active')
      }
    })
    }, 10);
      
  }

  addItem(item) {
    console.log(item)
    let itemAdded = this.summary.itemList.find( x => x.id == item.id)
    if(!itemAdded){
      this.summary.itemList.push(item)
    }
    if (item.quantity < 10) {
      item.quantity += 1;
      this.summary.amount += item.price;
    }
  }

  subItem(item) {
    if (item.quantity > 0) {
      item.quantity -= 1;
      this.summary.amount -= item.price;
    }
    if(item.quantity == 0){
      this.summary.itemList = this.summary.itemList.filter( x => x.id != item.id)
    }
  }


  categoryClickEventHandler(category){
    category = category.replace(' ', '')
    console.log(category)
    let allCategoryBlock = Array.from(document.getElementsByClassName('category-wrapper')  as HTMLCollectionOf<HTMLElement>)
    console.log(allCategoryBlock)
    allCategoryBlock.forEach(element => {
      element.classList.remove('show')
      element.classList.add('hidden')
    });
    let categoryBlock = document.getElementById(category)
    categoryBlock.classList.add('show')
    categoryBlock.classList.remove('hidden')

    let allCategoryBar = Array.from(document.getElementsByClassName('category-bar-items') as HTMLCollectionOf<HTMLElement>)
    allCategoryBar.forEach( ele => {
      console.log('Cateogry contains', ele.classList.contains(category))
      if(ele.classList.contains(category)){
        ele.classList.add('active')
      }else{
        ele.classList.remove('active')
      }
    })
  }

  clearSummary(){
    this.summary.amount = 0
    this.summary.itemList.forEach( item => {
      item.quantity = 0
    })
    this.summary.itemList = []
  }
  

  preparePlaceOrderBody(){
    let itemList = []
    this.summary.itemList.forEach( ele => {
      itemList.push(
        {
          item_id: ele.id,
          name: ele.name,
          quantity: ele.quantity,
          price: ele.price
        }
      )
    })
    let body = {   
      "order_list": itemList,
      "restaurant_id": this.restaurant_id,
    }
    return body
  }

  prepareSummary() {
    this.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        if (item.quantity) {
          let itemSummary = {
            item_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          };
          this.orderList.items.push(itemSummary);
        }
      });
    });
    this.orderList.amount = this.amount;
    this.orderList.restaurant_id = this.restaurant_id;
    console.log(this.orderList);
    let dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: this.summary,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Result from dialog component: ', result);
      if (result) {
        console.log(result);
        if(result.mode == 'wallet'){
          this._router.navigate(['/user/myorders'])
        }
        this.orderList = { items: [], amount: 0, restaurant_id: null };
      } else {
        this.orderList = { items: [], amount: 0, restaurant_id: null };
      }
    });
  }
}
