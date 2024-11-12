import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { SuccessMsgDialogComponent } from '../../shared/success-msg-dialog/success-msg-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgDialogComponent } from '../../shared/error-msg-dialog/error-msg-dialog.component';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { EcomPosOrdersComponent } from '../dialogbox/ecom-pos-orders/ecom-pos-orders.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectSubitemDialogComponent } from '../../shared/select-subitem-dialog/select-subitem-dialog.component';
import { HttpParams } from '@angular/common/http';
import { ReceiptPrintFormatter } from 'src/app/shared/utils/receiptPrint';
import { AddItemNoteDialogComponent } from '../../shared/add-item-note-dialog/add-item-note-dialog.component';

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PointOfSaleComponent {
  constructor(
    private menuService: MenuService,
    private router: Router,
    private orderService: OrdersService,
    private dialog: MatDialog,
    public printerConn: PrintConnectorService,
    private _counterService: CounterService,
    private __snackbar: MatSnackBar,
    private receiptPrintFormatter: ReceiptPrintFormatter,
    private matdialog: MatDialog,
    private meUtility: meAPIUtility,
    private dateUtils: dateUtils
  ) {

  }
  public menu;
  public summary;
  public paymentFlag = false;
  public modeOfPayment: 'cash' | 'upi' | 'credit' | 'card' = 'upi';
  public printerRequired = false;
  public disablePlace = false;
  public restaurantParcel = false;

  public restaurantName
  public restaurantAddress
  public restaurantGST 
  public parcelCharges = 5; // hardcode
  public filteredMenu;
  public menuCopy;
  public isPollingRequired;
  public isTaxInclusive
  public taxPercentage
  public pollingFrequency;
  searchText = '';
  private currentCategoryId;

  counters = [];
  public outletType;
  public isTableManagement
  public tableName = sessionStorage.getItem('table_name')
  public restaurantId
  public isPOS
  public isKOTEnabled
  public restaurantKDSenabled;
  public printReceipt: boolean = false

  ngOnInit() {
    this.summary = {
      amount: 0,
      itemList: [],
    };
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.restaurantName = restaurant['restaurant_name']
        this.restaurantAddress = restaurant['restaurant_address']
        this.restaurantGST = restaurant['restaurant_gst']
        this.isPollingRequired = restaurant['ui_polling_for_mobile_order_receipt_printing']
        this.isTaxInclusive = restaurant['tax_inclusive']
        this.taxPercentage =  this.isTaxInclusive? 0: Number(restaurant['tax_percentage'])
        this.pollingFrequency = Number(restaurant['ui_polling_for_mobile_order_receipt_printing_frequency'])
        this.outletType = restaurant['type'].toLowerCase()
        this.isTableManagement = restaurant['table_management']
        this.isPOS = restaurant['pos']
        this.isKOTEnabled = restaurant['kot_receipt']
        this.restaurantKDSenabled = restaurant['restaurant_kds'] 
        if(this.isTableManagement && !this.tableName){
            this.router.navigate(['./owner/dine-in/table-cockpit'])
        }
        this.fetchPOSMenu()
        this.fetchCounters()
      }
    )
  }

  openAddItemNotesWindow(item){
    this.matdialog.open(AddItemNoteDialogComponent, {data: item} )
    
  }

  fetchPOSMenu(){
    this.menuService
    .getPOSMenu(this.restaurantId)
    .subscribe((data) => {
      this.menu = data['menu'];
      this.printerRequired = data['printer_required'];
      this.restaurantParcel = data['restaurant_parcel'];
      this.createAllCategory()
      this.menu.map((category) => {
        category.category.items.filter(
          (element) => element.is_available == true
        );
      });
      this.setQuantity();
      this.menuCopy = JSON.parse(JSON.stringify(this.menu))
      this.showOnlyFirstCategory();
    });
  }

  fetchCounters(){
    this._counterService
      .getRestaurantCounter(this.restaurantId)
      .subscribe(
        (data) => {
          console.log('counters available', data);
          this.counters = data['counters'];
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
  }

  setQuantity() {
    this.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        item.quantity = 0;
        item.parcelQuantity = 0;
      });
    });
  }

  createAllCategory() {
    let allItems = [];
    this.menu.forEach((ele, index) => {
      if(ele.category.name.toUpperCase() != "FAVOURITES"){
        ele.category.items.forEach(item => {
          allItems.push(item);
        });
      }
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

  showOnlyFirstCategory() {
    this.filteredMenu = [this.menu[0]]
    this.currentCategoryId = this.filteredMenu[0].category.id
    setTimeout(() => {
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

  categoryClickEventHandler(category) {
    this.filteredMenu = JSON.parse(JSON.stringify(this.menu.filter((eleCategory) => eleCategory.category.id == category.category.id)))
    this.currentCategoryId = category.category.id
    let categoryName = category.category.name.replace(' ', '');
    let allCategoryBar = Array.from(
      document.getElementsByClassName(
        'category-bar-items'
      ) as HTMLCollectionOf<HTMLElement>
    );
    allCategoryBar.forEach((ele) => {
      if (ele.classList.contains(categoryName)) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    });

  }

  subItem(item) {
    let itemAdded = this.summary.itemList.find((x) => (x.item_id == item.item_id) && (x.item_unit_price_id == item.item_unit_price_id))
    if (itemAdded) {
        if (itemAdded.quantity > 0) {
          itemAdded.quantity -= 1
          this.summary.amount -= item.price
          if (itemAdded.item_unit_price_id) {
            this.filteredMenu[0].category.items.forEach(menuItem => {
              if (menuItem.id == itemAdded.item_id) {
                menuItem.item_unit_price_list.forEach(menuSubItem => {
                  if (menuSubItem.item_unit_price_id == itemAdded.item_unit_price_id) {
                    menuSubItem.quantity -= 1
                  }
                }) 
              }
            })
          }
        }
      this.summary.itemList = this.summary.itemList.filter((ele) => ele.quantity > 0)
      this.menuCopy = JSON.parse(JSON.stringify(this.menu))
    }
  }

  addItem(item) {
    // todo: update cart and handle parcel quantity and stock/inventory
    let itemAdded = this.summary.itemList.find((x) => (x.item_id == item.item_id) || (x.item_id == item.id) || (item.item_unit_price_id ? x.item_unit_price_id == item.item_unit_price_id: false))
    if (itemAdded) {
      if (item.item_unit_price_list?.length > 0) {
        let dialogRef = this.dialog.open(SelectSubitemDialogComponent, {
          data: {
            item: item, restaurantParcel: this.restaurantParcel,
            addfn: this.incrementSubItemfunction,
            subfn: this.decrementSubItemfunction,
            clearfn: this.clearSubItemfunction
          }, disableClose: true
        })
      } else {
        itemAdded.quantity += 1
        let pricebeAdded = this.isTaxInclusive? itemAdded.price: itemAdded.price * (this.taxPercentage * 0.01)
        this.summary.amount += pricebeAdded
        this.menuCopy = JSON.parse(JSON.stringify(this.menu))
      }
    } else {
      if (item.item_unit_price_list.length > 0) {
        let dialogRef = this.dialog.open(SelectSubitemDialogComponent, {
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
          "price": item.price,
          "counter": item.counter,
          "parcel_available": item.parcel_available,
          "tax_inclusive": item.tax_inclusive
        }
        item.quantity = 1
        let pricebeAdded = (this.isTaxInclusive? item.price: item.price * (this.taxPercentage * 0.01))
        this.summary.amount += pricebeAdded 
        this.summary.itemList.push(additionalItem)
        this.menuCopy = JSON.parse(JSON.stringify(this.menu))
      }
    }
    
  }

  incrementSubItemfunction = (subItem, item) => {
    let subItemAdded = this.summary.itemList.find((x) => x.item_unit_price_id == subItem.item_unit_price_id)
    if (subItemAdded) {
      subItemAdded.quantity += 1
      subItem.quantity += 1
      item.quantity += 1
    } else {
      let additionalSubItem = {
        name: subItem.item_unit_name,
        item_id: item.id,
        item_unit_price_id: subItem.item_unit_price_id,
        quantity: 1,
        parcel_quantity: 0, //hardcode
        price: subItem.price,
        counter: subItem.counter
      }
      subItem.quantity = 1
      item.quantity += 1
      this.summary.itemList.push(additionalSubItem)
    }
    this.summary.amount += subItem.price
    this.menuCopy = JSON.parse(JSON.stringify(this.menu))
  }

  decrementSubItemfunction =  (subItem, item) => {
      let subItemAdded = this.summary.itemList.find((x) => x.item_unit_price_id == subItem.item_unit_price_id)
      if (subItemAdded && subItem.quantity > 0) {
        subItem.quantity -= 1
        item.quantity -= 1
        subItemAdded.quantity -= 1
        this.summary.amount -= subItem.price
      } 
    this.summary.itemList = this.summary.itemList.filter((ele) => ele.quantity > 0)
    this.menuCopy = JSON.parse(JSON.stringify(this.menu))
  }
  
  clearSubItemfunction = (subItem, mainItem) => {
    let subItemAdded = this.summary.itemList.filter((x) => x.item_unit_price_id == subItem.item_unit_price_id)
    if (subItemAdded) {
      this.summary.amount -= subItemAdded[0].quantity * subItemAdded[0].price
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
    this.summary.itemList = this.summary.itemList.filter(item => item.quantity > 0)
    this.menuCopy = JSON.parse(JSON.stringify(this.menu))
  }

  calculateItemAmount(item) {
    return (item.tax_inclusive? item.price: item.price + (item.price * this.taxPercentage * 0.01)) * (item.quantity + (item.parcelQuantity? item.parcelQuantity: 0));
  }

  addParcelItem(item) {
    let itemAdded = this.summary.itemList.find((x) => x.id == item.id);
    if (!itemAdded) {
      this.summary.itemList.push(item);
      this.summary.amount += itemAdded.price + this.parcelCharges;
    }
    if (item.parcelQuantity < 10) {
      item.parcelQuantity += 1;
      this.summary.amount += item.price + this.parcelCharges;
    }
  }

  subParcelItem(item) {
    if (item.parcelQuantity > 0) {
      item.parcelQuantity -= 1;
      this.summary.amount -= item.price + this.parcelCharges;
    }
    if (item.quantity == 0 && item.parcelQuantity == 0) {
      this.summary.itemList = this.summary.itemList.filter(
        (x) => x.id != item.id
      );
    }
  }

  clearItem(clearItem) {
    console.log(clearItem)
    this.menuCopy = JSON.parse(JSON.stringify(this.menu))
    let clearItemList = this.summary.itemList
      .filter((x) => ((x.item_id == clearItem.item_id) && ( x.item_unit_price_id == clearItem.item_unit_price_id)))
    clearItemList.forEach(clrItem => {
      this.menu.forEach(category => {
        category.category.items.forEach(menuItem => {
          let subItemMatch = false
          let itemMatch = false
          if (menuItem.id == clrItem.item_id) {
            itemMatch = true
            menuItem.item_unit_price_list.forEach(menuSubItem => {
              if (clrItem.item_unit_price_id == menuSubItem.item_unit_price_id) {
                this.summary.amount -= (menuSubItem.quantity * menuSubItem.price)
                menuSubItem.quantity = 0
                clrItem.quantity = 0
                subItemMatch = true
              }
            })
          }
          if (itemMatch && !subItemMatch) {
            this.summary.amount -= (menuItem.quantity * menuItem.price)
            clrItem.quantity = 0
            menuItem.quantity = 0
          }
          
        })
      });
      })
    this.summary.itemList = this.summary.itemList.filter(sumItem => sumItem.quantity > 0)
    this.menuCopy = JSON.parse(JSON.stringify(this.menu))
  }

  clearSummary() {
    this.summary.amount = 0;
    this.summary.itemList.forEach(clrItem => {
      this.menu.forEach(category => {
        category.category.items.forEach(menuItem => {
          if (menuItem.id == clrItem.item_id) {
            menuItem.item_unit_price_list.forEach(menuSubItem => {
              if (clrItem.item_unit_price_id == menuSubItem.item_unit_price_id) {
                this.summary.amount -= (menuSubItem.quantity * menuSubItem.price)
                menuSubItem.quantity = 0
                clrItem.quantity = 0
              }
            })
          }
        })
      })
      })
    this.summary.itemList = [];
  }

  incrementParcelQuantity(item) {
    item.parcelQuantity += item.quantity;
    item.quantity = 0;
    this.summary.amount += this.parcelCharges * item.parcelQuantity;
  }

  calculateTotalAmount() {
    let total = 0;
    this.summary.itemList.forEach((ele) => {
      total += (ele.tax_inclusive? ele.price : ( ele.price + (ele.price * (this.taxPercentage * 0.01)))) * (ele.quantity + (ele.parcel_quantity? ele.parcel_quantity: 0));
    });
    // 150.5
    // 151 - pos, receipt
    return Math.round(total);
  }

  filterItems() {
    if (this.searchText) {
      this.categoryClickEventHandler(
        this.menu[this.menu.length - 1]
      );
      
      this.filteredMenu[this.filteredMenu.length - 1].category.items =
        JSON.parse(JSON.stringify(this.menuCopy[this.menuCopy.length - 1].category.items.filter((item) =>
         {
          let acronym = item.name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
          return ((item.name.toLowerCase().includes(this.searchText.toLowerCase())) || (acronym.toLowerCase().includes(this.searchText.toLowerCase())))
        }
        )));
    } else {
      this.menu = JSON.parse(JSON.stringify(this.menuCopy));
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
  
  preparePlaceOrderBody() {
    let itemList = [];
    let actualTotalAmount = 0;
    this.summary.itemList.forEach((ele) => {
      actualTotalAmount += ele.price * (ele.quantity + (ele.parcelQuantity? ele.parcelQuantity: 0));
      itemList.push({
        item_id: ele.item_id,
        item_name: ele.name,
        price: ele.price,
        item_unit_price_id: ele.item_unit_price_id,
        quantity: ele.quantity + (ele.parcel_quantity? ele.parcel_quantity: 0),
        parcel_quantity: ele.parcel_quantity,
        counter: ele.counter,
        note: ele.note,
        tax_inclusive: ele.tax_inclusive
      });
    });
    let body = {
      pos: true,
      order_list: itemList,
      restaurant_id: this.restaurantId,
      payment_mode: this.modeOfPayment,
      printer_conneted: this.printerConn.usbSought,
      total_amount: this.summary.amount,
      actual_total_amount: actualTotalAmount,
    };
    if(this.isTableManagement){
      body['table_id'] =  Number(sessionStorage.getItem('table_id'))
      body['table_name'] = sessionStorage.getItem('table_name')
      body['wkot_printed'] = this.printerConn.usbSought
      body['kot_printed'] = this.printerConn.usbSought
    }
    return body;
  }

  getPrintStatus() {
    if (this.printerConn.usbSought) {
      return 'primary';
    } else {
      return 'warn';
    }
  }

  print(printObjs){
    if(this.printerConn.usbSought){
      let printConnect = this.printerConn.printService.init();
      printObjs.forEach((ele) => {
        if (ele.text != '') {
          printConnect.writeCustomLine(ele);
        }
      });
      printConnect
        .feed(4)
        .cut()
        .flush();
        return true
    }else{
      return false
    }
  }


  testPrint() {
    let printConnect = this.printerConn.printService.init();
    let content = [
      {
        text: 'This is Test print'.toUpperCase().repeat(5),
        size: 'normal',
        justification: 'left',
      },
    ];
    content.forEach((ele) => printConnect.writeCustomLine(ele));
    printConnect.feed(5).cut().flush();
  }

  placePOSOrder() {
    this.disablePlace = true;
    let body = this.preparePlaceOrderBody();
    this.orderService.createOrders(body).subscribe(
      (data) => {
        body['order_no'] = data['order_no']
        body['ordered_time'] =  this.dateUtils.getDateForRecipePrint()
        if (this.isKOTEnabled && this.printReceipt) {
          this.receiptPrintFormatter.confirmedOrderObj = body
          let counterReceiptObjs = this.receiptPrintFormatter.getKOTReceiptText(this.counters)
          counterReceiptObjs.forEach((counterReceiptObj) => {
            this.print(counterReceiptObj)
          })
        }
        if(this.printReceipt){
          this.receiptPrintFormatter.confirmedOrderObj = body
          let receiptObjs = this.receiptPrintFormatter.getCustomerPrintableText()
          this.print(receiptObjs)
        }
        let dialogRef = this.dialog.open(SuccessMsgDialogComponent, {
          data: {
            msg: `Order created successfully. Order No: ${data['order_no']}`,
          },
        });
        dialogRef.afterClosed().subscribe((data) => {
          this.ngOnInit();
        });
        this.disablePlace = false;
      },
      (error) => {
        console.log('Place order response', error);
        let errorMsg =
          error.status != 0
            ? `Failed to create Order. ${error.error.error}`
            : 'Failed to create order. No internet';
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: errorMsg },
        });
        this.disablePlace = false;
      }
    );
  }

  placeEcomOrder() {
    let dialogRef = this.dialog.open(EcomPosOrdersComponent, { data: this.summary });
    dialogRef.afterClosed().subscribe((data) => {
      if (data['result']) {
        this.ngOnInit();
      }
    });
  }

  placeOrder(printReceipt) {
    this.printReceipt = printReceipt
    if (this.outletType == 'e-commerce') {
      this.placeEcomOrder();
    } else if(this.outletType == 'restaurant' && this.isTableManagement){
      this.placePrintTableOrder()
    } else if (this.outletType == 'restaurant') {
      this.placePOSOrder();
    }  else {
      this.__snackbar.open(`Invalid Outlet type: ${this.outletType}`, '', {
        duration: 3000,
      });
    }
  }


  placePrintTableOrder(){
    this.disablePlace = true;
    let body = this.preparePlaceOrderBody();
    this.orderService.createOrders(body).subscribe(
      (data) => {
        debugger
        body['order_no'] = data['order_no']
        body['ordered_time'] = this.dateUtils.getDateForRecipePrint(new Date())
        if(this.printerConn.usbSought){
          this.receiptPrintFormatter.confirmedOrderObj = body
          // let counterReceiptObjs = this.receiptPrintFormatter.getWKOTReceiptTextV2()
          // counterReceiptObjs.forEach((counterReceiptObj) => {
          //   this.print(counterReceiptObj)
          // })
          if(this.isKOTEnabled){
            let counterReceiptObjs = this.receiptPrintFormatter.getKOTReceiptText(this.counters)
            counterReceiptObjs.forEach((counterReceiptObj) => {
              this.print(counterReceiptObj)
            })
          }
        }
        let dialogRef = this.dialog.open(SuccessMsgDialogComponent, {
          data: {
            msg: `Order created successfully. Order No: ${data['order_no']}`,
          },
        });
        dialogRef.afterClosed().subscribe((data) => {
          this.ngOnInit();
        });
        this.disablePlace = false;
      },
      (error) => {
        console.log('Place order response', error);
        let errorMsg =
          error.status != 0
            ? `Failed to create Order. ${error.error.error}`
            : 'Failed to create order. No internet';
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: errorMsg },
        });
        this.disablePlace = false;
      }
    );
  }



  navigateToEditMenu() {
    this.router.navigate([
      `/owner/settings/edit-menu/`,
    ]);
  }

  navigateToOrders() {
    let navigationURL =
    this.restaurantKDSenabled
        ? '/owner/orders/pending-orders'
        : this.outletType == 'e-commerce'
        ? '/owner/orders/unconfirmed-orders'
        : '/owner/orders/orders-history';
    this.router.navigate([navigationURL]);
  }



  updateTotalAmount() {
    this.summary.amount = 0;
    this.summary.itemList.forEach((ele) => {
      this.summary.amount += ele.quantity * ele.price;
    });
    console.log(this.summary.itemList);
    this.summary.itemList = this.summary.itemList.filter(
      (ele) => ele.quantity != 0
    );
  }

  ngOnDestroy() {
    sessionStorage.removeItem('table_id');
    sessionStorage.removeItem('table_name');
  }
}
