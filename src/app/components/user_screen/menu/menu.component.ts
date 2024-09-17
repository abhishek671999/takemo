import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { HttpParams } from '@angular/common/http';
import { meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';
import { cartConnectService } from 'src/app/shared/services/connect-components/connect-components.service';
import { SelectSubitemDialogComponent } from '../../shared/select-subitem-dialog/select-subitem-dialog.component';
import { ParcelDialogComponent } from '../parcel-dialog/parcel-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(
    private _menuService: MenuService,
    private __cartService: cartConnectService,
    private matdialog: MatDialog,
    private router: Router,
    private _route: ActivatedRoute,
    private __sessionWrapper: sessionWrapper,
    private _tableService: TablesService,
  ) {}

public orderList = {
    itemList: [],
    parcel_amount: 0,
    amount: 0,
    restaurant_id: null,
    restaurant_parcel: false,
    table_id: null,
  };

  public restaurantParcel: boolean;
  public menu_response
  public filteredMenu;
  public tableSelected;
  public currentCategory;
  
  public menu = {}
  public menuCopy = {}
  public availableCategoryList = []
  public searchText = '';
  public tablesAvailable = []
  
  public restaurant_id = 6
  public showSpinner = true
  public hideCart = true
  public tableManagement = this.__sessionWrapper.isTableManagementEnabled();

 ngOnInit() {
  this.showSpinner = true
  this._route.paramMap.subscribe((params: ParamMap) => {
    this.restaurant_id = parseInt(params.get('id'));
    let tableID = parseInt(params.get('table_id'));
    sessionStorage.setItem('restaurant_id', String(this.restaurant_id));
    this._menuService.getMenu(this.restaurant_id).subscribe(
      (data) => {
        this.restaurantParcel = data['restaurant_parcel'];
        this.menu_response = data;
        let allItems = []
        data['menu'].forEach((category) => {
          if(!category.category.hide_category){
            let availableItems = category.category.items.filter((item) => item.is_available)
            availableItems.forEach((item) => {
              item['quantity'] = 0
              item['parcel_quantity'] = 0
          })
            let name = category.category.name
            category.category.items.forEach(item => {
              item['category_name'] = name
            })
            this.menu[name] = category.category.items
            allItems.push(...availableItems)
          }
        })
        this.menuCopy = JSON.parse(JSON.stringify(this.menu))
        this.setCartQuantity()
        this.menu['all'] = allItems
        this.showFirstCategory()
        this.availableCategoryList = Object.keys(this.menu)

        this.showSpinner = false
      },
      (error) => {
        alert('Error while loading menu');
      }
    );
    if(this.tableManagement){
      let httpParams = new HttpParams();
      httpParams = httpParams.append(
        'restaurant_id',
        this.__sessionWrapper.getItem('restaurant_id')
      );
      this._tableService.getTables(httpParams).subscribe(
        (data) => {
          this.tablesAvailable = data['restaurants'];
          this.tablesAvailable.forEach((value) => {
            if (value.table_id == tableID) {
              this.tableSelected = value;
            }
          });
        },
        (error) => {
          alert('Failed to fetch table');
        }
      );
    }
  })
  };

  setCartQuantity(){
    let cartItems = this.__cartService.getCartItems()
    if(cartItems){
      if(cartItems.amount > 0 && cartItems.itemList.length == 0){
        console.log(cartItems.amount, cartItems.itemList)
        alert('Failed to fetch cart')
        this.clearCart()
      }else{
        this.orderList.amount = cartItems.amount
        this.orderList.parcel_amount = cartItems.parcel_amount
        cartItems.itemList.forEach(cartItem => {
          if(cartItem){
            let matchedItem = this.menu[cartItem.category_name].filter(menuItem => menuItem.id == cartItem.id)
            if(matchedItem.length > 0 ){
              matchedItem[0].quantity = cartItem.quantity
              matchedItem[0].parcel_quantity = cartItem.parcel_quantity
              matchedItem[0].item_unit_price_list = cartItem.item_unit_price_list
              this.orderList.itemList.push(matchedItem[0])
            } 
          }
        })
      }
    }
  }

  showFirstCategory(){
    this.currentCategory = Object.keys(this.menu)[0]
    console.log('first categroy: ', Object.values(this.menu)[0])
    this.filteredMenu = Object.values(this.menu)[0]
  }

  categoryClickEventHandler(currentCategory){
    this.filteredMenu = this.menu[currentCategory]
  }

  getMRPriceForItem(item) {
    let item_mrp_price = item.item_unit_price_list.length > 0 ? item.item_unit_price_list[0].mrp_price : item.mrp_price 
    return item_mrp_price
  }

  getPriceForItem(item) {
    let item_price = item.item_unit_price_list.length > 0 ? item.item_unit_price_list[0].price : item.price 
    return item_price
  }

  filterItems(){
    if (this.searchText) {
      this.currentCategory = 'all'
      this.filteredMenu = this.menu['all'].filter(item => item.name.toLowerCase().includes(this.searchText.toLowerCase()))
    } else {
      this.showFirstCategory()
      
    }
  }

  prepareSummary() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.position = { bottom: `0px` };
    matDialogConfig.width = '98vw'
    matDialogConfig.height = '100%'
    this.orderList.table_id = this.tableSelected?.table_id;
    this.orderList.restaurant_id = this.restaurant_id;
    this.orderList.restaurant_parcel = this.restaurantParcel
    let dialogRef = this.matdialog.open(ConfirmationDialogComponent, {
      data: {
        summary: this.orderList,
        addfn: this.incrementItemFunction,
        subfn: this.decrementItemFunction,
        clearfn: this.clearItemFunction
      },
   

    });
    dialogRef.updatePosition(matDialogConfig.position)
    dialogRef.updateSize(matDialogConfig.width, matDialogConfig.height)
    dialogRef.afterClosed().subscribe((result) => {
      this.orderList.itemList = this.orderList.itemList.filter((item) => item.quantity > 0)
      if (result) {
        if (result.mode == 'wallet') {
          this.router.navigate(['/user/myorders']);
        } else {
          this.orderList = result.orderlist;
          this.__cartService.setCartItems(this.orderList)
        }
      }
    });
  }

  addItem(item, event){
    // todo: update cart and handle parcel quantity and stock/inventory
    event.stopPropagation();
    console.log(item)
    if(item.parcel_available) {
      let dialogRef = this.matdialog.open(ParcelDialogComponent, {
        data: {
          item: item, orderList: this.orderList
        }
      })
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.result){
            this.__cartService.setCartItems(this.orderList)
          }
        }
      )
    }
    else if (item.item_unit_price_list.length > 0) {
      let dialogRef = this.matdialog.open(SelectSubitemDialogComponent, {
        data: {
          item: item, restaurantParcel: this.restaurantParcel,
          addfn: this.incrementSubItemfunction,
          subfn: this.decrementSubItemfunction,
          clearfn: this.clearSubItemfunction
        }, disableClose: true
      })
    } else {
      item.quantity += 1
      this.orderList.amount += item.price
    }

    let itemAdded = this.orderList.itemList.find((x) => x.id == item.id)
    if(!itemAdded) this.orderList.itemList.push(item)
    this.__cartService.setCartItems(this.orderList)
  }

  subItem(item, event){
    event.stopPropagation();
    if(item.parcel_available) {
      let dialogRef = this.matdialog.open(ParcelDialogComponent, {
        data: {
          item: item, orderList: this.orderList
        }
      })
      dialogRef.afterClosed().subscribe(
        (data: any) => {

          if(data?.result){
            this.__cartService.setCartItems(this.orderList)
          }
        }
      )
    }
    else if (item.item_unit_price_list.length > 0) {
      let dialogRef = this.matdialog.open(SelectSubitemDialogComponent, {
        data: {
          item: item, restaurantParcel: this.restaurantParcel,
          addfn: this.incrementSubItemfunction,
          subfn: this.decrementSubItemfunction,
          clearfn: this.clearSubItemfunction
        }, disableClose: true
      })
    } else {
      if (item.quantity > 0) {
        item.quantity -= 1
        this.orderList.amount -= item.price
      }
      this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
      this.__cartService.setCartItems(this.orderList)
    }
  }


  incrementItemFunction = (lineItem) => {
    lineItem.quantity += 1
    this.orderList.amount += lineItem.price
    this.__cartService.setCartItems(this.orderList)
  }

  decrementItemFunction = (lineItem) => {
    lineItem.quantity -= 1
    this.orderList.amount -= lineItem.price
    this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
    this.__cartService.setCartItems(this.orderList)

    }


  clearItemFunction = (clearItem) => {
    this.orderList.amount -= (clearItem.quantity * clearItem.price)
    this.orderList.parcel_amount -= (clearItem.parcel_quantity * 5)
    clearItem.quantity = 0
    clearItem.parcel_quantity = 0
    this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
    this.__cartService.setCartItems(this.orderList)
  }

  incrementSubItemfunction = (subItem, item) => {
    subItem.quantity += 1
    item.quantity += 1
    this.orderList.amount += subItem.price
    let subItemAdded = this.orderList.itemList.find((x) => x.item_unit_price_id == subItem.item_unit_price_id)
    if(!subItemAdded) this.orderList.itemList.push(subItem)
    this.__cartService.setCartItems(this.orderList)
  }

  decrementSubItemfunction =  (subItem, item) => {
      let subItemAdded = this.orderList.itemList.find((x) => x.item_unit_price_id == subItem.item_unit_price_id)
      if (subItemAdded && subItem.quantity > 0) {
        subItem.quantity -= 1
        item.quantity -= 1
        this.orderList.amount -= subItem.price
      } 
    this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
    this.__cartService.setCartItems(this.orderList)
  }
  
  clearSubItemfunction = (subItem, mainItem) => {
    let subItemAdded = this.orderList.itemList.filter((x) => x.item_unit_price_id == subItem.item_unit_price_id)
    if (subItemAdded) {
      this.orderList.amount -= subItemAdded[0].quantity * subItemAdded[0].price
      mainItem.quantity -= subItem.quantity
      subItem.quantity = 0 
    }
    this.orderList.itemList = this.orderList.itemList.filter(item => item.quantity > 0)
    this.__cartService.setCartItems(this.orderList)
  }


  addCartItem(item, event) {
    event.stopPropagation()
    if(item.parcel_available) {
      let dialogRef = this.matdialog.open(ParcelDialogComponent, {
        data: {
          item: item, orderList: this.orderList
        }
      })
      dialogRef.afterClosed().subscribe(
        (data: any) => {

          if(data?.result){
            this.__cartService.setCartItems(this.orderList)
          }
        }
      )}
    else{
      item.quantity += 1
    this.orderList.amount += item.price
    this.__cartService.setCartItems(this.orderList)
    }
  }

  
  subCartItem(item, event) {
    event.stopPropagation()
    if(item.quantity > 0){
      if(item.parcel_available) {
        let dialogRef = this.matdialog.open(ParcelDialogComponent, {
          data: {
            item: item, orderList: this.orderList
          }
        })
        dialogRef.afterClosed().subscribe(
          (data: any) => {
            if(data?.result){
              this.__cartService.setCartItems(this.orderList)
            }
          }
        )}
        else{
          item.quantity -= 1
          this.orderList.amount -= item.price
          this.__cartService.setCartItems(this.orderList)
        }
    }
  }

  clearCartItem(item, event) {
    event.stopPropagation()
    this.orderList.amount -= (item.quantity * item.price)
    this.orderList.parcel_amount -= (item.parcel_quantity * 5) //hardcode
    item.quantity = 0
    item.parcel_quantity = 0
    this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
    debugger
    this.__cartService.setCartItems(this.orderList)
  }

  togglehideCart() {
    this.hideCart = !this.hideCart;
    setTimeout(() => {
      let cartBar = document.getElementById(
        "collapsable-cart-bar"
      ) as HTMLElement;
      console.log(cartBar)
      cartBar.style.zIndex = this.hideCart ? '0' : '5';
    }, 5);
    
  }

  clearCart() {
    this.orderList.amount = 0
    this.orderList.parcel_amount = 0
    this.orderList.itemList = []
    this.__cartService.setCartItems(this.orderList)
    this.menu = JSON.parse(JSON.stringify(this.menuCopy))
    this.filteredMenu = this.menu[this.currentCategory]
  }

  
}
