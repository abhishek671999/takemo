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

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  amount: number = 0;
  orderList = {
    itemList: [],
    amount: 0,
    restaurant_id: null,
    restaurant_parcel: false,
    table_id: null,
  };
  constructor(
    private _menuService: MenuService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _orderService: OrdersService,
    private _tableService: TablesService,
    private _meUtilityService: meAPIUtility,
    private __sessionWrapper: sessionWrapper,
    private __cartService: cartConnectService
  ) {}

  menu_response: any;
  showSpinner = true;
  restaurant_id: number;
  restaurantParcel = false;
  tableManagement = this.__sessionWrapper.isTableManagementEnabled();
  tableSelected;
  tableAvailable;
  menu;
  filteredMenu;
  searchText = '';
  hideCategory = true;
  hideCart = true;
  currentCategory = null;
  selectedCategory = null;

  ngOnInit() {
    this.showSpinner = true;
    this._route.paramMap.subscribe((params: ParamMap) => {
      this.restaurant_id = parseInt(params.get('id'));
      let tableID = parseInt(params.get('table_id'));
      sessionStorage.setItem('restaurant_id', String(this.restaurant_id));
      this._menuService.getMenu(this.restaurant_id).subscribe(
        (data) => {
          this.menu_response = data;
          this.menu = data['menu'];
          this.restaurantParcel = data['restaurant_parcel'];
          this.menu.map((category) => {
            category.category.items.filter(
              (element) => element.is_available == true
            );
          });
          this.setQuantity();
          this.showSpinner = false;
          this.showOnlyFirstCategory();
          this.createAllCategory();
          this.filteredMenu = JSON.parse(JSON.stringify(this.menu));
        },
        (error) => {
          console.log('Error while getting menu: ', error);
          this.showSpinner = false;
          alert('Error while loading menu');
        }
      );
      if (this.tableManagement) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append(
          'restaurant_id',
          this.__sessionWrapper.getItem('restaurant_id')
        );
        this._tableService.getTables(httpParams).subscribe(
          (data) => {
            this.tableAvailable = data['restaurants'];
            this.tableAvailable.forEach((value) => {
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
    });
  }

  setQuantity() {
    let cartItems = this.__cartService.getCartItems()
    this.orderList.itemList = cartItems? cartItems.itemList: []
  this.orderList.amount = cartItems ? cartItems.amount : 0
    
    this.menu.forEach(category => {
      category.category.items.forEach(item => {
        item.quantity = 0
        item.parcelQuantity = 0
        if (cartItems) {
          let matchedCartSubItems = cartItems?.itemList.filter(ele => item.item_unit_price_list.some(subItem => subItem.item_unit_price_id == ele.item_unit_price_id) )
          let matchedCartItems = cartItems?.itemList.filter(ele => ele.item_id == item.id)
          if (matchedCartSubItems.length > 0) {
            let matchedSubItem = item.item_unit_price_list.filter(subItem => subItem.item_unit_price_id == matchedCartSubItems[0].item_unit_price_id)
            matchedSubItem[0].quantity = matchedCartSubItems[0].quantity
            item.quantity += matchedCartSubItems[0].quantity
          } else if (matchedCartItems.length > 0) {
            item.quantity = matchedCartItems[0].quantity
          }
        }
      });
  });
  }

  createAllCategory() {
    let allItems = [];
    this.menu.forEach((ele, index) => {
      ele.category.items.forEach(item => {
        allItems.push(item);
      });
    });
    this.menu.push({
      category: {
        id: null,
        name: 'All',
        hide_category: false,
        items: allItems,
      },
    });
  }

  togglehideCategory() {
    this.hideCategory = !this.hideCategory;
    setTimeout(() => {
      let categoryBar = document.getElementById(
        'collapsable-category-bar'
      ) as HTMLElement;
      categoryBar.style.zIndex = this.hideCategory ? '0' : '5';
    }, 5);
    
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

  showOnlyFirstCategory() {
    setTimeout(() => {
      let allCategoryBlock = Array.from(
        document.getElementsByClassName(
          'category-wrapper'
        ) as HTMLCollectionOf<HTMLElement>
      );
      allCategoryBlock.forEach((ele, index) => {
        if (index == 0) {
          this.currentCategory = ele.id;
          ele.classList.add('show');
          ele.classList.remove('hidden');
        } else {
          ele.classList.remove('show');
          ele.classList.add('hidden');
        }
      });

      let allCategoryBar = Array.from(
        document.getElementsByClassName(
          'category-bar-items'
        ) as HTMLCollectionOf<HTMLElement>
      );
      allCategoryBar.forEach((ele, index) => {
        if (index == 0) {
          ele.classList.add('active');
        } else {
          ele.classList.remove('active');
        }
      });
    }, 10);
  }

  updateSummary(orderList) {
    if (orderList.itemList.length == 0) {
      this.setQuantity();
    } else {
      this.setQuantity();
      this.amount = orderList.amount;
      orderList.itemList.forEach((item) => {
        this.menu_response.menu.forEach((category) => {
          category.category.items.forEach((menuItem) => {
            if (menuItem.id == item.id) {
              menuItem.quantity = item.quantity;
              menuItem.parcelQuantity = item.parcelQuantity;
            }
          });
        });
      });
    }
  }

  addSubItem(subItem, item) {
    let subItemAdded = this.orderList.itemList.find((x) => x.item_unit_price_id == subItem.item_unit_price_id)
    if (subItemAdded) {
      subItem.quantity += 1
      item.quantity += 1
    } else {
      let additionalSubItem = {
        item_id: item.id,
        item_unit_price_id: subItem.item_unit_price_id,
        quantity: 1,
        parcelQuantity: 0
      }
      subItem.quantity = 1
      item.quantity += 1
      this.orderList.itemList.push(additionalSubItem)
    }
  }

  incrementSubItemfunction = (subItem, item) => {
    let subItemAdded = this.orderList.itemList.find((x) => x.item_unit_price_id == subItem.item_unit_price_id)
    if (subItemAdded) {
      subItemAdded.quantity += 1
      subItem.quantity += 1
      item.quantity += 1
    } else {
      let additionalSubItem = {
        name: item.name,
        item_id: item.id,
        item_unit_price_id: subItem.item_unit_price_id,
        quantity: 1,
        parcel_quantity: 0, //hardcode
        price: subItem.price
      }
      subItem.quantity = 1
      item.quantity += 1
      this.orderList.itemList.push(additionalSubItem)
    }
    this.orderList.amount += subItem.price
    this.__cartService.setCartItems(this.orderList)
  }

  decrementSubItemfunction =  (subItem, item) => {
      let subItemAdded = this.orderList.itemList.find((x) => x.item_unit_price_id == subItem.item_unit_price_id)
      if (subItemAdded && subItem.quantity > 0) {
        subItem.quantity -= 1
        item.quantity -= 1
        subItemAdded.quantity -= 1
        this.orderList.amount -= subItem.price
      } 
    this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
    this.__cartService.setCartItems(this.orderList)
  }
  
  clearSubItemfunction = (subItem, mainItem) => {
    let subItemAdded = this.orderList.itemList.filter((x) => x.item_unit_price_id == subItem.item_unit_price_id)
    if (subItemAdded) {
      this.orderList.amount -= subItemAdded[0].quantity * subItemAdded[0].price
      this.filteredMenu.forEach(category => {
        if (category.category.name.toLowerCase() != 'all') {
          let item = category.category.items.filter(item => mainItem.id == item.id && item.item_unit_price_list.filter(subEle => subEle.item_unit_price_id == subItem.item_unit_price_id).length > 0)
          if (item.length > 0) {
            item[0].quantity -= subItemAdded[0].quantity
          }
        }
      })
      subItemAdded[0].quantity = 0
    }
    
    subItem.quantity = 0
    this.orderList.itemList = this.orderList.itemList.filter(item => item.quantity > 0)
    this.__cartService.setCartItems(this.orderList)
  }

  addItem(item, event) {
    // todo: update cart and handle parcel quantity and stock/inventory
    event.stopPropagation();
    let itemAdded = this.orderList.itemList.find((x) => x.item_id == item.id)
    if (itemAdded) {
      if (item.item_unit_price_list.length > 0) {
        let dialogRef = this._dialog.open(SelectSubitemDialogComponent, {
          data: {
            item: item, restaurantParcel: this.restaurantParcel,
            addfn: this.incrementSubItemfunction,
            subfn: this.decrementSubItemfunction,
            clearfn: this.clearSubItemfunction
          }, disableClose: true
        })
      } else {
        itemAdded.quantity += 1
        item.quantity += 1
        this.orderList.amount += item.price
        this.__cartService.setCartItems(this.orderList)
      }
    } else {
      if (item.item_unit_price_list.length > 0) {
        let dialogRef = this._dialog.open(SelectSubitemDialogComponent, {
          data: {
            item: item, restaurantParcel: this.restaurantParcel,
            addfn: this.incrementSubItemfunction,
            subfn: this.decrementSubItemfunction,
            clearfn: this.clearSubItemfunction
          }, disableClose: true
        })
      } else {
        let additionalItem = {
          "item_id": item.id,
          "quantity": 1,
          "parcel_quantity": 0,
          "name": item.name,
          "price": item.price
        }
        item.quantity = 1
        this.orderList.amount += item.price
        this.orderList.itemList.push(additionalItem)
        this.__cartService.setCartItems(this.orderList)
      }
    }



  //   let itemAdded = this.orderList.itemList.find((x) => x.id == item.id);
  //   if (itemAdded) {
  //     if (itemAdded.item_unit_price_list.length > 0) {
  //       let dialogRef = this._dialog.open(SelectSubitemDialogComponent, { data: { item: item, restaurantParcel: this.restaurantParcel }, disableClose: true })
  //       dialogRef.afterClosed().subscribe(
  //         data => {
  //           this.orderList.amount += data['amount']
  //           this.updateSelectedItem(item)
  //           this.orderList.itemList.push(item);
  //         },
  //         error => {
  //           console.log('error occurred: ', error)
  //         }
  //       )
  //     } else {
  //       if (
  //         itemAdded.quantity < 30 &&
  //         (itemAdded.inventory_stock
  //           ? itemAdded.quantity + itemAdded.parcelQuantity <
  //             itemAdded.inventory_stock
  //           : true)
  //       ) {
  //         itemAdded.quantity += 1;
  //         this.updateSelectedItem(itemAdded)
  //         this.orderList.amount += itemAdded.price;
  //       }
  //     }
  //   } else {
  //     if (item.item_unit_price_list.length > 0) {
  //       let dialogRef = this._dialog.open(SelectSubitemDialogComponent, { data: {item: item, restaurantParcel: this.restaurantParcel} })
  //       dialogRef.afterClosed().subscribe(
  //         data => {
  //           console.log('This is return data: ', data)
  //           this.orderList.amount += data['amount']
  //           this.updateSelectedItem(item)
  //           this.orderList.itemList.push(item);
  //         },
  //         error => {
  //           console.log('error occurred: ', error)
  //         }
  //       )
  //     } else {
  //       if (
  //         item.quantity < 30 &&
  //         (item.inventory_stock
  //           ? item.quantity + item.parcelQuantity < item.inventory_stock
  //           : true)
  //       ) {
  //         item.quantity += 1;
  //         this.updateSelectedItem(item)
  //         this.orderList.amount += item.price;
  //         this.orderList.itemList.push(item);
  //       }
  //     }
      
  //   }
  //   this.__cartService.setCartItems(this.orderList)
  }


  subItem(item, event) {
    event.stopPropagation();

    let itemAdded = this.orderList.itemList.find((x) => x.item_id == item.id)
    if (itemAdded) {
      if (item.item_unit_price_list.length > 0) {
        let dialogRef = this._dialog.open(SelectSubitemDialogComponent, {
          data: {
            item: item, restaurantParcel: this.restaurantParcel,
            addfn: this.incrementSubItemfunction,
            subfn: this.decrementSubItemfunction,
            clearfn: this.clearSubItemfunction
          }, disableClose: true
        })
      } else {
        if (itemAdded.quantity > 0) {
          itemAdded.quantity -= 1
          item.quantity -= 1
          this.orderList.amount -= item.price
        }
        this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
      }

    } 

    // if (itemAdded) {
    //   if (itemAdded.quantity > 0 || item.quantity > 0) {
    //     itemAdded.quantity -= 1
    //     this.updateSelectedItem(itemAdded)
    //     this.orderList.amount -= itemAdded.price;
    //   }
    // }
    // if (itemAdded?.quantity == 0 || item.quantity == 0) {
    //   this.orderList.itemList = this.orderList.itemList.filter(
    //     (x) => x.id != item.id
    //   );
    // }
    // this.__cartService.setCartItems(this.orderList)
  }

  updateSelectedItem(item) {
    this.filteredMenu.forEach(category => {
      category.category.items.forEach(existingItem => {
        if (existingItem.id == item.id) {
          existingItem.quantity = item.quantity
        }
      } )
    });
    this.menu.forEach(category => {
      category.category.items.forEach(existingItem => {
        if (existingItem.id == item.id) {
          existingItem.quantity = item.quantity
        }
      } )
    });     
  }

  addCartItem(item, event) {
    event.stopPropagation()
    const initialState = JSON.parse(JSON.stringify(item))
    item.quantity += 1
    if (this.updateFilteredMenu(item)) {
      this.orderList.amount += item.price
      this.__cartService.setCartItems(this.orderList)
    } else {
      this.updateFilteredMenu(item)
      item.quantity = initialState.quantity
    }
  }

  
  subCartItem(item, event) {
    event.stopPropagation()
    const initialState = JSON.parse(JSON.stringify(item))
    item.quantity -= 1
    if (this.updateFilteredMenu(item)) {
      this.orderList.amount -= item.price
      this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
      this.__cartService.setCartItems(this.orderList)
    } else {
      this.updateFilteredMenu(item)
      item.quantity = initialState.quantity
    }
  }


  clearCartItem(item, event) {
    event.stopPropagation()
    this.orderList.amount -= ((item.quantity * item.price) + (item.parcel_quantity? item.parcel_quantity: 0 * item.price))
    item.quantity = 0
    item.parcelQuantity = 0
    this.orderList.itemList = this.orderList.itemList.filter((ele) => ele.quantity > 0)
    this.updateFilteredMenu(item)
    this.__cartService.setCartItems(this.orderList)
  }
  
  incrementItemFunction = (lineItem) => {

    const initialState = JSON.parse(JSON.stringify(lineItem))
    lineItem.quantity += 1
    if (this.updateFilteredMenu(lineItem)) {
      this.orderList.amount += initialState.price
    } else {
      lineItem.quantity = initialState.quantity
      this.updateFilteredMenu(lineItem)
    }
    

    // this.filteredMenu.forEach(element => {
    //   if (element.category.name.toLowerCase() != 'all') {
    //     element.category.items.forEach(item => {
    //       let subItem = item.item_unit_price_list.filter(x => (x.item_unit_price_id == lineItem.item_unit_price_id))
    
    //       if (item.id == lineItem.item_id && subItem.length > 0) {
    //         lineItem.quantity += 1
    //         subItem[0].quantity += 1
    //         item.quantity += 1
    //         this.orderList.amount += subItem[0].price
    //       } else if (item.id == lineItem.item_id) {
    //         item.quantity += 1
    //         lineItem.quantity += 1
    //         this.orderList.amount += item.price
    //         return
    //       } 
    //     }) 
    //   }
    // });
  }

  decrementItemFunction = (lineItem) => {
    const initialState = JSON.parse(JSON.stringify(lineItem))
    if (lineItem.quantity > 0) {
      lineItem.quantity -= 1
      if (this.updateFilteredMenu(lineItem)) {
        this.orderList.amount -= initialState.price
      } else {
        lineItem.quantity = initialState.quantity
        this.updateFilteredMenu(lineItem)
      }
      }
      }

    // this.filteredMenu.forEach(element => {
    //   if (element.category.name.toLowerCase() != 'all') {
    //     element.category.items.forEach(item => {
    //       let subItem = item.item_unit_price_list.filter(x => (x.item_unit_price_id == lineItem.item_unit_price_id))
          
    //       if (item.id == lineItem.item_id && subItem.length > 0 && (subItem[0].quantity > 0)) {
    //         lineItem.quantity -= 1
    //         subItem[0].quantity -= 1
    //         item.quantity -= 1
    //         this.orderList.amount -= subItem[0].price
    //         return
    //       } else if (item.id == lineItem.item_id && lineItem.quantity > 0) {
    //         item.quantity -= 1
    //         lineItem.quantity -= 1
    //         this.orderList.amount -= item.price
    //         return
    //       } 
    //     }) 
    //   }
    // });
  // }

  clearItemFunction = (clearItem) => {
    const initialState = JSON.parse(JSON.stringify(clearItem))
    clearItem.quantity = 0
    if (this.updateFilteredMenu(clearItem)) {
      this.orderList.amount -= (initialState.quantity * initialState.price)
    } else {
      clearItem.quantity = initialState.quantity
      this.updateFilteredMenu(clearItem)
    }
  }

  updateFilteredMenu = (lineItem) => {
    for (const category of this.filteredMenu) {
      if (category.category.name.toLowerCase() != 'all') {
        for (const item of category.category.items) {
          let subItem = item.item_unit_price_list.filter(x => (x.item_unit_price_id == lineItem.item_unit_price_id))
          if (item.id == lineItem.item_id && subItem.length > 0) {
            item.quantity = subItem[0].quantity > lineItem.quantity ? item.quantity - (subItem[0].quantity - lineItem.quantity): item.quantity + (lineItem.quantity - subItem[0].quantity)
            subItem[0].quantity = lineItem.quantity
            return true
          } else if (item.id == lineItem.item_id) {
            item.quantity = lineItem.quantity
            return true
          } 
        }
      } 
    }
    return false
  }




    
    // this.orderList.itemList.forEach(cartItem => {
    //   if (cartItem.item_id == clearItem.item_id || cartItem.item_unit_price_id == clearItem.item_unit_price_id) {
    //     this.filteredMenu.forEach(category => {
    //       if (category.category.name.toLowerCase() != 'all') {
    //         category.category.items.forEach((item) =>
    //         {
    //           if (item.id == clearItem.item_id && item.item_unit_price_list.filter(subItem => subItem.item_unit_price_id == clearItem.item_unit_price_id).length > 0) {
    //             item.quantity -= clearItem.quantity
    //             item.item_unit_price_list.forEach(subItem => {
    //               if (subItem.item_unit_price_id == clearItem.item_unit_price_id) {
    //                 subItem.quantity = 0
    //               }
    //             })
    //           }
    //           else if (item.id == clearItem.item_id) {
    //             item.quantity -= clearItem.quantity
    //           }                
    //         }
    //       )
    //     this.orderList.amount -= (clearItem.quantity * clearItem.price)
    //     cartItem.quantity -= clearItem.quantity
    //       }
    //     })
    //   }
    // })
  // }

  prepareSummary() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.position = { bottom: `0px` };
    this.orderList.table_id = this.tableSelected?.table_id;
    this.orderList.restaurant_id = this.restaurant_id;
    let dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        summary: this.orderList,
        addfn: this.incrementItemFunction,
        subfn: this.decrementItemFunction,
        clearfn: this.clearItemFunction
      },
      panelClass: ['animate__animated', 'animate__slideInUp']
    });
    dialogRef.updatePosition(matDialogConfig.position)
    dialogRef.afterClosed().subscribe((result) => {
      this.orderList.itemList = this.orderList.itemList.filter((item) => item.quantity > 0)
      if (result) {
        console.log(result);
        
        if (result.mode == 'wallet') {
          this._router.navigate(['/user/myorders']);
        } else {
          this.orderList = result.orderlist;
          this.__cartService.setCartItems(this.orderList)
        }
      }
    });
  }

  categoryClickEventHandler(category) {
    this.currentCategory = category;
    category = category.replace(' ', '');
    let allCategoryBlock = Array.from(
      document.getElementsByClassName(
        'category-wrapper'
      ) as HTMLCollectionOf<HTMLElement>
    );
    allCategoryBlock.forEach((element) => {
      element.classList.remove('show');
      element.classList.add('hidden');
    });
    let categoryBlock = document.getElementById(category);
    categoryBlock.classList.add('show');
    categoryBlock.classList.remove('hidden');

    let allCategoryBar = Array.from(
      document.getElementsByClassName(
        'category-bar-items'
      ) as HTMLCollectionOf<HTMLElement>
    );
    allCategoryBar.forEach((ele) => {
      if (ele.classList.contains(category)) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    });
  }

  filterItems() {
    if (this.searchText) {
      this.categoryClickEventHandler(
        this.filteredMenu[this.filteredMenu.length - 1].category.name
      );
      this.filteredMenu[this.filteredMenu.length - 1].category.items =
        this.menu[this.menu.length - 1].category.items.filter((item) =>
          item.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
    } else {
      this.filteredMenu = JSON.parse(JSON.stringify(this.menu));
      this.showOnlyFirstCategory();
    }
  }

  getMRPriceForItem(item) {
    let item_mrp_price = item.item_unit_price_list.length > 0 ? item.item_unit_price_list[0].mrp_price : item.mrp_price 
    return item_mrp_price
  }

  getPriceForItem(item) {
    let item_price = item.item_unit_price_list.length > 0 ? item.item_unit_price_list[0].price : item.price 
    return item_price
  }

  
}
