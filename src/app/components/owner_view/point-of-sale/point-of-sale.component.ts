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
    private __sessionWrapper: sessionWrapper
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
        this.menu.map((category) => {
          category.category.items.filter(
            (element) => element.is_available == true
          );
        });
        this.setQuantity();
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

  showOnlyFirstCategory() {
    setTimeout(() => {
      let allCategoryBlock = Array.from(
        document.getElementsByClassName(
          'category-wrapper'
        ) as HTMLCollectionOf<HTMLElement>
      );
      allCategoryBlock.forEach((ele, index) => {
        if (index == 0) {
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

  categoryClickEventHandler(category) {
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

  subItem(item) {
    if (item.quantity > 0) {
      item.quantity -= 1;
      this.summary.amount -= item.price;
    }
    if (item.quantity == 0 && item.parcelQuantity == 0) {
      this.summary.itemList = this.summary.itemList.filter(
        (x) => x.id != item.id
      );
    }
  }

  addItem(item) {
    let itemAdded = this.summary.itemList.find((x) => x.id == item.id);
    if (itemAdded) {
      itemAdded.quantity += 1;
      this.summary.amount += itemAdded.price;
    } else {
      item.quantity += 1;
      this.summary.amount += item.price;
      this.summary.itemList.push(item);
    }
  }

  calculateItemAmount(item) {
    return item.price * (item.quantity + item.parcelQuantity);
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

  clearSummary() {
    this.summary.amount = 0;
    this.summary.itemList.forEach((item) => {
      item.quantity = 0;
    });
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
      total += ele.price * (ele.quantity + ele.parcelQuantity);
    });
    return total;
  }

  preparePlaceOrderBody() {
    let itemList = [];
    let actualTotalAmount = 0;
    this.summary.itemList.forEach((ele) => {
      actualTotalAmount += ele.price * (ele.quantity + ele.parcelQuantity);
      itemList.push({
        item_id: ele.id,
        quantity: ele.quantity + ele.parcelQuantity,
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
    this.dialog.open(EcomPosOrdersComponent, { data: this.summary });
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

  clearItem(item) {
    console.log(item);
    this.summary.itemList
      .filter((x) => x.id == item.id)
      .forEach((ele) => {
        this.summary.amount -= ele.quantity * ele.price;
        ele.quantity = 0;
        ele.parcelQuantity = 0;
      });
    this.summary.itemList = this.summary.itemList.filter(
      (x) => x.id != item.id
    );
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
