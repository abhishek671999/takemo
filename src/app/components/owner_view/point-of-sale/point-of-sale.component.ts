import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { SuccessMsgDialogComponent } from '../../shared/success-msg-dialog/success-msg-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorMsgDialogComponent } from '../../shared/error-msg-dialog/error-msg-dialog.component';
import { PrinterService } from 'src/app/shared/services/printer/printer.service';
import { UsbDriver } from 'src/app/shared/services/printer/usbDriver';
import { MatRadioButton } from '@angular/material/radio';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { EcomPosOrdersComponent } from '../dialogbox/ecom-pos-orders/ecom-pos-orders.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectSubitemDialogComponent } from '../../shared/select-subitem-dialog/select-subitem-dialog.component';

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
    private dateUtils: dateUtils,
    private _counterService: CounterService,
    private __snackbar: MatSnackBar,
    private __sessionWrapper: sessionWrapper,
  ) {}
  public menu;
  public summary;
  public paymentFlag = false;
  public modeOfPayment: 'cash' | 'upi' | 'credit' | 'card' = 'upi';
  public printerRequired = false;
  public disablePlace = false;
  public restaurantParcel = false;

  public restaurantName = null;
  public restaurantAddress = null;
  public restaurantGST = null;
  public parcelCharges = 5; // hardcode
  public filteredMenu;
  public menuCopy
  searchText = '';
  private currentCategoryId;

  counters = [];
  public outletType = this.__sessionWrapper.getItem('restaurantType').toLowerCase();
  public isTableManagement = this.__sessionWrapper.isTableManagementEnabled()
  public tableName = this.__sessionWrapper.getItem('table_name')

  ngOnInit() {
    this.summary = {
      amount: 0,
      itemList: [],
    };
    this.menuService
      .getPOSMenu(this.__sessionWrapper.getItem('restaurant_id'))
      .subscribe((data) => {
        this.menu = data['menu'];
        this.printerRequired = data['printer_required'];
        this.restaurantParcel = data['restaurant_parcel'];
        this.restaurantParcel = true;
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
    this._counterService
      .getRestaurantCounter(this.__sessionWrapper.getItem('restaurant_id'))
      .subscribe(
        (data) => {
          console.log('counters available', data);
          this.counters = data['counters'];
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
    this.restaurantName = this.__sessionWrapper.getItem('restaurant_name');
    this.restaurantAddress = this.__sessionWrapper.getItem('restaurant_address');
    this.restaurantGST = this.__sessionWrapper.getItem('restaurant_gst');
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
    this.filteredMenu = this.menu.filter((eleCategory) => eleCategory.category.id == category.category.id)
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

  // subItem(item) {
  //   if (item.quantity > 0) {
  //     item.quantity -= 1;
  //     this.summary.amount -= item.price;
  //   }
  //   if (item.quantity == 0 && item.parcelQuantity == 0) {
  //     this.summary.itemList = this.summary.itemList.filter(
  //       (x) => x.id != item.id
  //     );
  //   }
  // }
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
        this.summary.amount += itemAdded.price
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
          "price": item.price
        }
        item.quantity = 1
        this.summary.amount += item.price
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
        price: subItem.price
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
    return item.price * (item.quantity + (item.parcelQuantity? item.parcelQuantity: 0));
  }

  addParcelItem(item) {
    console.log('Parcel: ', item);
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
      total += ele.price * (ele.quantity + (ele.parcel_quantity? ele.parcel_quantity: 0));
    });
    return total;
  }

  filterItems() {
    if (this.searchText) {
      this.categoryClickEventHandler(
        this.menu[this.menu.length - 1]
      );
      this.filteredMenu[this.filteredMenu.length - 1].category.items =
        this.menuCopy[this.menuCopy.length - 1].category.items.filter((item) =>
          item.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
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
        item_unit_price_id: ele.item_unit_price_id,
        quantity: ele.quantity + (ele.parcelQuantity? ele.parcelQuantity: 0),
        parcel_quantity: ele.parcelQuantity,
      });
    });
    let body = {
      pos: true,
      order_list: itemList,
      table_id: Number(this.__sessionWrapper.getItem('table_id')),
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id'),
      payment_mode: this.modeOfPayment,
      printer_conneted: this.printerConn.usbSought,
      total_amount: this.summary.amount,
      actual_total_amount: actualTotalAmount,
    };
    return body;
  }

  trimString(text, length = 16) {
    return text.length > length
      ? text.substring(0, length - 2) + '..'
      : text + '.'.repeat(length - text.length);
  }

  getPrintStatus() {
    if (this.printerConn.usbSought) {
      return 'primary';
    } else {
      return 'warn';
    }
  }

  getFixedLengthString(string, length, prefix = true, fixValue = '0') {
    string = String(string);
    console.log('string length', string.toLocaleString().length);
    return string.length > length
      ? string.substring(0, length)
      : prefix
      ? fixValue.repeat(length - string.length) + string
      : string + fixValue.repeat(length - string.length);
  }

  getFormattedDineInItemDetails() {
    let formattedTable = '';
    this.summary.itemList.forEach((element: any, index) => {
      if (element.quantity > 0) {
        let trimmedName = this.getFixedLengthString(
          element.name.substring(0, 24),
          24,
          false,
          ' '
        );
        let remainingName =
          trimmedName.trim() == element.name
            ? ''
            : ' ' +
              this.getFixedLengthString(
                element.name.substring(24, 48),
                24,
                false,
                ' '
              ) +
              '\n';
        let itemQty = this.getFixedLengthString(element.quantity, 3, true, ' ');
        let itemPrice = this.getFixedLengthString(element.price, 4, true, ' ');
        let itemAmount = this.getFixedLengthString(
          element.quantity * element.price,
          4,
          true,
          ' '
        );
        formattedTable += `-${trimmedName}  ${itemQty}  ${itemPrice}  ${itemAmount}\n${remainingName}`;
      }
    });
    return formattedTable;
  }

  getFormattedParcelItemDetails() {
    let inititalString = '------------------Parcel------------------\n';
    let formattedTable = inititalString;
    let totalParcelItem = 0;
    this.summary.itemList.forEach((element: any) => {
      if (element.parcelQuantity > 0) {
        let trimmedName = this.getFixedLengthString(
          element.name.substring(0, 24),
          24,
          false,
          ' '
        );
        let remainingName =
          trimmedName.trim() == element.name
            ? ''
            : ' ' +
              this.getFixedLengthString(
                element.name.substring(24, 48),
                24,
                false,
                ' '
              ) +
              '\n';
        let itemQty = this.getFixedLengthString(
          element.parcelQuantity,
          3,
          true,
          ' '
        );
        let itemPrice = this.getFixedLengthString(element.price, 4, true, ' ');
        let itemAmount = this.getFixedLengthString(
          element.parcelQuantity * element.price,
          4,
          true,
          ' '
        );
        totalParcelItem += element.parcelQuantity;

        formattedTable += `-${trimmedName}  ${itemQty}  ${itemPrice}  ${itemAmount}\n${remainingName}`;
      }
    });
    let parcelInfo = `${this.getFixedLengthString(
      'Parcel Charges Rs5/item',
      24,
      false,
      ' '
    )}   ${this.getFixedLengthString(
      totalParcelItem,
      3,
      true,
      ' '
    )}  ${this.getFixedLengthString(
      '5',
      4,
      true,
      ' '
    )}  ${this.getFixedLengthString(totalParcelItem * 5, 4, true, ' ')}`;
    return formattedTable == inititalString ? '' : formattedTable + parcelInfo;
  }

  getGstDetails() {
    let gstAmount = (this.summary.amount * 0.05).toFixed(2);
    return `GST @ 5%: Rs.${gstAmount}`;
  }

  getTotalAmount() {
    return `Total Amount: Rs.${this.calculateTotalAmount()}`;
  }
  getFormattedCurrentDate() {
    return this.dateUtils.getDateForRecipePrint();
  }

  getCustomerPrintableText() {
    let sectionHeader1 =
      '-'.repeat(16) + `${this.modeOfPayment.toUpperCase()}` + '-'.repeat(16);
    let tableHeader = '       DESCRIPTION         QTY  RATE   AMT';
    let endNote = 'Inclusive of GST (5%)\nThank you. Visit again';
    let sectionSeperatorCharacters = '-'.repeat(42);
    let content = [
      {
        text: this.restaurantName,
        justification: 'center',
        bold: true,
        size: 'xlarge',
      },
      {
        text: this.restaurantAddress.replace(/-/gi, '\n'),
        justification: 'center',
        bold: true,
      },
      {
        text: this.dateUtils.getDateForRecipePrint(),
        justification: 'right',
      },
      {
        text: sectionHeader1,
        bold: true,
        justification: 'center',
      },
      {
        text: tableHeader,
        underline: true,
        justification: 'left',
      },
      {
        text: this.getFormattedDineInItemDetails(),
        justification: 'left',
      },
      {
        text: this.getFormattedParcelItemDetails(),
        justification: 'left',
      },
      {
        text: sectionSeperatorCharacters,
        justification: 'center',
      },
      {
        text: this.getGstDetails(),
        bold: true,
        justification: 'right',
      },
      {
        text: sectionSeperatorCharacters,
        justification: 'center',
      },
      {
        text: this.getTotalAmount(),
        bold: true,
        size: 'xlarge',
        justification: 'right',
      },
      {
        text: sectionSeperatorCharacters,
        justification: 'center',
      },
      {
        text: endNote,
        justification: 'center',
      },
      {
        text: this.restaurantGST,
        justification: 'center',
      },
    ];
    return content;
  }

  getCounterPrintableText() {
    let countersWithOrders = [];
    this.counters.forEach((counterEle) => {
      let counterItemList = this.summary.itemList.filter(
        (itemEle) => itemEle.counter.counter_id == counterEle.counter_id
      );
      if (counterItemList.length) {
        let formattedText = '';
        counterItemList.forEach((element) => {
          let itemAmount = element.quantity * element.price;
          formattedText += `${this.trimString(element.name)}\t${
            element.quantity
          }\t${element.price}\tRs.${itemAmount}\n`;
        });
        let printObj = [
          {
            text: counterEle.counter_name,
            justification: 'center',
            size: 'xxlarge',
            bold: true,
          },
          {
            text: formattedText,
            size: 'large',
          },
        ];
        countersWithOrders.push(printObj);
      }
    });
    console.log(countersWithOrders);
    return countersWithOrders;
  }

  printRecipt(orderNum) {
    if (this.printerConn.usbSought) {
      //to-do: Interchange dialogbox call and print call
      let printConnect = this.printerConn.printService.init();
      this.getCustomerPrintableText().forEach((ele) => {
        if (ele.text != '') {
          printConnect.writeCustomLine(ele);
        }
      });
      printConnect
        .writeCustomLine({
          text: `Order No: ${orderNum}`,
          size: 'large',
          bold: true,
          justification: 'center',
        })
        .feed(4)
        .cut()
        .flush();

      // this.getCounterPrintableText().forEach(ele =>{
      //   ele.forEach(element => {
      //     printConnect.writeCustomLine(element)
      //   }
      //   );
      //   printConnect
      //   .writeCustomLine({
      //     text: `Order No: ${orderNum}`,
      //     size: 'xxlarge',
      //     bold: true,
      //     justification: 'center',
      //   })
      //   .feed(5).cut('partial')
      // })
      // printConnect
      // .flush();
    }
  }
  testPrint() {
    let printConnect = this.printerConn.printService.init();
    let content = [
      {
        text: 'This is Test print'.toUpperCase().repeat(50),
        size: 'normal',
        justification: 'left',
      },
    ];
    content.forEach((ele) => printConnect.writeCustomLine(ele));
    printConnect.feed(5).cut().flush();
  }

  placePOSOrder() {
    debugger
    this.disablePlace = true;
    let body = this.preparePlaceOrderBody();
    this.printerRequired && !this.printerConn.usbSought
      ? this.printerConn.seekUSB()
      : null;
    this.orderService.createOrders(body).subscribe(
      (data) => {
        let orderNum = data['order_no'];
        this.printRecipt(orderNum);
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

  placeOrder() {
    if (this.outletType == 'e-commerce') {
      this.placeEcomOrder();
    } else if (this.outletType == 'restaurant') {
      this.placePOSOrder();
    } else {
      this.__snackbar.open(`Invalid Outlet type: ${this.outletType}`, '', {
        duration: 3000,
      });
    }
  }

  navigateToEditMenu() {
    this.router.navigate([
      `/owner/settings/edit-menu/${this.__sessionWrapper.getItem('restaurant_id')}`,
    ]);
  }

  navigateToOrders() {
    let navigationURL =
    this.__sessionWrapper.getItem('restaurant_kds') == 'true'
        ? '/owner/orders/pending-orders'
        : this.__sessionWrapper.getItem('restaurantType') == 'e-commerce'
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
