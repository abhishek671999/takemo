import { Component, OnDestroy } from '@angular/core';
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
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { HttpParams } from '@angular/common/http';
import { meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';
import { cartConnectService } from 'src/app/shared/services/connect-components/connect-components.service';

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
  hideCart = false;
  currentCategory = null;
  summary = {
    amount: 0,
    itemList: [],
  };

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
    this.orderList.amount = cartItems? cartItems.amount: 0
    console.log('Setting quantity:', this.menu_response, cartItems);
    this.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        let matchedItem = cartItems?.itemList.filter((ele) => ele.id == item.id)
        if (cartItems && matchedItem?.length) {
          item.quantity = matchedItem[0].quantity
          item.parcelQuantity = matchedItem[0].parcelQuantity
        } else {
          item.quantity = 0;
        item.parcelQuantity = 0;
        }
        
      });
    });
    
  }

  createAllCategory() {
    let allItems = [];
    this.menu.forEach((ele, index) => {
      allItems.push(...ele.category.items);
    });
    //allItems = allItems.flat()
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
    let categoryBar = document.getElementById(
      'collapsable-category-bar'
    ) as HTMLElement;
    categoryBar.style.zIndex = this.hideCategory ? '5' : '0';
  }

  togglehideCart() {
    this.hideCart = !this.hideCart;
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

  addItem(item, event) {
    console.log('Clciked', item);
    event.stopPropagation();

    let itemAdded = this.orderList.itemList.find((x) => x.id == item.id);
    if (itemAdded) {
      console.log(itemAdded);
      if (
        itemAdded.quantity < 30 &&
        (itemAdded.inventory_stock
          ? itemAdded.quantity + itemAdded.parcelQuantity <
            itemAdded.inventory_stock
          : true)
      ) {
        itemAdded.quantity += 1;
        if (item !== itemAdded) item.quantity += 1;
        this.orderList.amount += itemAdded.price;
      }
    } else {
      if (
        item.quantity < 30 &&
        (item.inventory_stock
          ? item.quantity + item.parcelQuantity < item.inventory_stock
          : true)
      ) {
        item.quantity += 1;
        this.orderList.amount += item.price;
        this.orderList.itemList.push(item);
      }
    }
    this.__cartService.setCartItems(this.orderList)
  }
  subItem(item, event) {
    event.stopPropagation();
    let itemAdded = this.orderList.itemList.find((x) => x.id == item.id);
    if (itemAdded) {
      if (itemAdded.quantity > 0 || item.quantity > 0) {
        item !== itemAdded ? (item.quantity -= 1) : (itemAdded.quantity -= 1);
        this.orderList.amount -= itemAdded.price;
      }
    }
    if (itemAdded?.quantity == 0 || item.quantity == 0) {
      this.orderList.itemList = this.summary.itemList.filter(
        (x) => x.id != item.id
      );
    }
    this.__cartService.setCartItems(this.orderList)
  }

  prepareSummary() {
    // this.menu_response.menu.forEach((category) => {
    //   category.category.items.forEach((item) => {
    //     if (item.quantity || item.parcelQuantity) {
    //       let itemSummary = {
    //         id: item.id,
    //         name: item.name,
    //         quantity: item.quantity,
    //         price: item.price,
    //         parcelQuantity: item.parcelQuantity,
    //       };
    //       this.orderList.itemList.push(itemSummary);
    //     }
    //   });
    // });
    // this.orderList.amount = this.amount;
    this.orderList.table_id = this.tableSelected?.table_id;
    this.orderList.restaurant_id = this.restaurant_id;
    let dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: this.orderList,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Result from dialog component: ', result);
      if (result) {
        console.log(result);
        if (result.mode == 'wallet') {
          this._router.navigate(['/user/myorders']);
        } else {
          this.orderList = result.orderlist;
          this.__cartService.setCartItems(this.orderList)
        }
        //this.updateSummary(result.orderList);
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
      console.log(this.menu, this.filteredMenu);
    }
  }
}
