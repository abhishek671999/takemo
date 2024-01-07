import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { SuccessMsgDialogComponent } from '../../shared/success-msg-dialog/success-msg-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgDialogComponent } from '../../shared/error-msg-dialog/error-msg-dialog.component';

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.css']
})
export class PointOfSaleComponent {
  constructor(
    private menuService: MenuService, 
    private router: Router, 
    private orderService: OrdersService,
    private dialog: MatDialog
    ){}
  public menu;
  public summary;


  ngOnInit(){
    this.summary = {
      amount: 0,
      itemList: []
    }
    this.menuService.getMenu(sessionStorage.getItem('restaurant_id')).subscribe(
      data => {
        this.menu = data['menu'];
        this.menu.map((category) => {
          category.category.items.filter(
            (element) => element.is_available == true
          );
        });
        this.setQuantity();
        this.showOnlyFirstCategory()
        console.log('THis is menu: ', this.menu)
      }
    )
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
  
  subItem(item) {
    if (item.quantity > 0) {
      item.quantity -= 1;
      this.summary.amount -= item.price;
    }
    if(item.quantity == 0){
      this.summary.itemList = this.summary.itemList.filter( x => x.id != item.id)
    }
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
          quantity: ele.quantity
        }
      )
    })
    let body = {   
      "pos": true,
      "order_list": itemList,
      "restaurant_id": sessionStorage.getItem('restaurant_id')
    }
    return body
  }

  placeOrder(){
    let body = this.preparePlaceOrderBody()
  console.log(body)
  this.orderService.createOrders(body).subscribe(
    data => {
      let dialogRef = this.dialog.open(SuccessMsgDialogComponent, {data: {msg: `Order created successfully. Order No: ${data['order_no']}`} })
      dialogRef.afterClosed().subscribe(
        data => {
          this.ngOnInit()
        }
      )
    },
    error => {
      this.dialog.open(ErrorMsgDialogComponent, {data: {msg: `Faile to create Order. ${error.error.error}`}})
    }
  )

  }


  navigateToEditMenu(){
    this.router.navigate([`/owner/edit-menu/${sessionStorage.getItem('restaurant_id')}`])
  }

  navigateToPendingOrders(){
    this.router.navigate(['/owner/pending-orders'])
  }

  clearItem(item){
    console.log(item)
    this.summary.itemList.filter( x => x.id == item.id).forEach(
      ele => {
        this.summary.amount -= ele.quantity * ele.price
        ele.quantity = 0
      }
    )
    this.summary.itemList = this.summary.itemList.filter( x => x.id != item.id)
  }

  updateTotalAmount(){
    this.summary.amount = 0
    this.summary.itemList.forEach(ele =>{
      this.summary.amount += ele.quantity * ele.price
    })
    console.log(this.summary.itemList)
    this.summary.itemList = this.summary.itemList.filter(ele => ele.quantity != 0)
    
  }

}
