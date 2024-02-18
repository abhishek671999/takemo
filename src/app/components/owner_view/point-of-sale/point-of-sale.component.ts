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

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PointOfSaleComponent {
  constructor(
    private menuService: MenuService,
    private router: Router,
    private orderService: OrdersService,
    private dialog: MatDialog,
    public printerConn: PrintConnectorService,
    private dateUtils: dateUtils
  ) {}
  public menu;
  public summary;
  public usbSought;
  public paymentFlag = false;
  public modeOfPayment: 'cash' | 'upi' | 'credit' | 'card' = 'upi';
  public printerRequired = false;

  ngOnInit() {
    this.summary = {
      amount: 0,
      itemList: [],
    };
    this.menuService
      .getPOSMenu(sessionStorage.getItem('restaurant_id'))
      .subscribe((data) => {
        this.menu = data['menu'];
        this.printerRequired = !data['printer_required'];
        this.menu.map((category) => {
          category.category.items.filter(
            (element) => element.is_available == true
          );
        });
        this.setQuantity();
        this.showOnlyFirstCategory();
        console.log('THis is menu: ', this.menu);
      });
  }

  setQuantity() {
    console.log('Setting quantity:', this.menu);
    this.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        item.quantity = 0;
        item.parcelQuantity = 0;
      });
    });
  }

  showOnlyFirstCategory() {
    setTimeout(() => {
      console.log('trying to show only first element');
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
    console.log(category);
    let allCategoryBlock = Array.from(
      document.getElementsByClassName(
        'category-wrapper'
      ) as HTMLCollectionOf<HTMLElement>
    );
    console.log(allCategoryBlock);
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
      console.log('Cateogry contains', ele.classList.contains(category));
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
    console.log(item);
    let itemAdded = this.summary.itemList.find((x) => x.id == item.id);
    if (!itemAdded) {
      this.summary.itemList.push(item);
    }
    if (item.quantity < 30) {
      item.quantity += 1;
      this.summary.amount += item.price;
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
    }
    if (item.parcelQuantity < 10) {
      item.parcelQuantity += 1;
      this.summary.amount += item.price;
    }
  }

  subParcelItem(item) {
    if (item.parcelQuantity > 0) {
      item.parcelQuantity -= 1;
      this.summary.amount -= item.price;
    }
    if (item.quantity == 0 && item.parcelQuantity == 0) {
      this.summary.itemList = this.summary.itemList.filter(
        (x) => x.id != item.id
      );
    }
  }

  incrementParcelQuantity(item) {
    item.parcelQuantity += item.quantity;
    item.quantity = 0;
  }

  clearSummary() {
    this.summary.amount = 0;
    this.summary.itemList.forEach((item) => {
      item.quantity = 0;
    });
    this.summary.itemList = [];
  }

  preparePlaceOrderBody() {
    let itemList = [];
    this.summary.itemList.forEach((ele) => {
      itemList.push({
        item_id: ele.id,
        quantity: ele.quantity + ele.parcelQuantity,
        parcel_quantity: ele.parcelQuantity,
      });
    });
    let body = {
      pos: true,
      order_list: itemList,
      restaurant_id: sessionStorage.getItem('restaurant_id'),
      payment_mode: this.modeOfPayment,
    };
    return body;
  }

  trimString(text, length=20) {
    return text.length > length
      ? text.substring(0, length - 3) + '...'
      : text + '.'.repeat(length - text.length);
  }

  getPrintStatus(){
    if(this.printerConn.usbSought){
      return "primary"
    }else{
      return "warn"
    }
  }

  getFormattedDineInItemDetails() {
    let formattedTable = '';
    this.summary.itemList.forEach((element: any) => {
      if (element.quantity > 0) {
        let itemAmount = element.quantity * element.price;
        formattedTable += `${this.trimString(element.name)}\t${
          element.quantity
        }\t${element.price}\tRs.${itemAmount}\n`;
      }
    });
    return formattedTable;
  }

  getFormattedParcelItemDetails() {
    let formattedTable = 'Parcel\n';
    this.summary.itemList.forEach((element: any) => {
      if (element.parcelQuantity > 0) {
        let itemAmount = element.parcelQuantity * element.price;
        formattedTable += `${this.trimString(element.name)}\t${
          element.parcelQuantity
        }\t${element.price}\tRs.${itemAmount}\n`;
      }
    });
    return formattedTable == 'Parcel\n' ? '' : formattedTable;
  }

  getTotalAmount() {
    return `Total Amount: ${this.summary.amount}`;
  }
  getFormattedCurrentDate() {
    return this.dateUtils.getDateForRecipePrint();
  }

  getPrintableText() {
    let caffeeInfo = `MATHAS COFFEES\n(VINAYAKA ENTERPRISE)\nNear Ashoka pillar\nJayanagar 1st block\nBengaluru.560011\nGSTIN:29A0NPT4745M22`;
    let sectionHeader1 = `................${this.modeOfPayment.toUpperCase()}..................`
    let sectionSplitter = '..........................................';
    let tableHeader = 'DESCRIPTION\t\tQTY\tRATE\tAMOUNT';
    let endNote = 'Inclusive of GST (5%)\nThank you. Visit again';
    let content = [
      {
        text: caffeeInfo,
        size: 'xlarge',
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
        underline: true
      },
      {
        text: this.getFormattedDineInItemDetails(),
      },
      {
        text: this.getFormattedParcelItemDetails(),
      },
      {
        text: this.getTotalAmount(),
        bold: true,
        justification: 'right',
        size: 'xlarge',
      },
      {
        text: sectionSplitter,
      },
      {
        text: endNote,
        justification: 'center',
      },
    ];
    return content;
  }

  // async seekUSB() {
  //   await this.usbDriver.requestUsb().subscribe((data) => {
  //     console.log('my data', data);
  //     this.printerConn.printService.setDriver(this.usbDriver);
  //     this.printerConn.printService.isConnected.subscribe(result => {
  //       console.log('usb observer', result)
  //       this.usbSought = result
  //     }
        
  //       )
  //   });
  // }

  printRecipt(orderNum){
    if (this.printerConn.usbSought ) {     //to-do: Interchange dialogbox call and print call
      let printConnect = this.printerConn.printService.init();
      this.getPrintableText().forEach((ele) => {
        if (ele.text != '') {
          printConnect.writeCustomLine(ele);
        }
      });
      printConnect
        .writeCustomLine({
          text: `Order No: ${orderNum}`,
          size: 'xxlarge',
          bold: true,
          justification: 'center',
        })
        .feed(5)
        .cut()
        .flush();
    }
  }

  placeOrder() {
    let body = this.preparePlaceOrderBody();
    this.printerRequired && !this.printerConn.usbSought? this.printerConn.seekUSB() : null;
    this.orderService.createOrders(body).subscribe(
      (data) => {
        let orderNum = data['order_no'];
        this.printRecipt(orderNum)
        let dialogRef = this.dialog.open(SuccessMsgDialogComponent, {
          data: {
            msg: `Order created successfully. Order No: ${data['order_no']}`,
          },
        });
        dialogRef.afterClosed().subscribe((data) => {
          this.ngOnInit();
        });
      },
      (error) => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: `Faile to create Order. ${error.error.error}` },
        });
      }
    );
  }

  navigateToEditMenu() {
    this.router.navigate([
      `/owner/settings/edit-menu/${sessionStorage.getItem('restaurant_id')}`,
    ]);
  }

  navigateToPendingOrders() {
    this.router.navigate(['/owner/pending-orders']);
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
}
