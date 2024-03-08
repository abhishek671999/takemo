import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { SuccessMsgDialogComponent } from '../../shared/success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from '../../shared/error-msg-dialog/error-msg-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { config } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public summary,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private __ordersService: OrdersService,
    private dialog: MatDialog,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
  }

  public isPayment;
  public platformFee = undefined || {};
  public totalAmount;
  public roundOffAmount;
  public platformFeeAmount;
  public paybyWalletCheck;
  public walletPayMessage;
  public paymentMethod;
  public isWalletPayment = false;
  public restaurantParcel = false;

  public upiId = 'pascitopcprivatelimited.ibz@icici';
  public transactionId = '';
  public deliveryAddress = '';
  public parcelCharges = 5 // hardcode

  ngOnInit() {
    this.totalAmount = this.summary.amount;
    this.restaurantParcel = this.summary.restaurant_parcel;
    this.dialogRef.disableClose = true;
    this.dialogRef.updateSize('auto', 'auto')
    this.__ordersService.checkIfPaymentRequired().subscribe(
      (data) => {
        console.log(data);
        this.isPayment = data['payment_required'];
        this.paymentMethod = this.isPayment ? data['payment_mode'] : 'others';
        if (data['tax_inclusive']) {
          console.log('INcluding tax');
          this.platformFee['platform_fee_percentage'] =
            data['platform_fee_percentage'];
          this.platformFee['platform_fee_gst_percentage'] =
            data['platform_fee_gst_percentage'];
          this.platformFee['platformFeeAmount'] =
            this.platformFee['platform_fee_percentage'] *
            this.totalAmount *
            (1 + this.platformFee['platform_fee_gst_percentage']);
          this.totalAmount =
            this.totalAmount + this.platformFee['platformFeeAmount'];
          this.roundOffAmount = this.totalAmount.toFixed(2) - this.totalAmount;

          this.platformFeeAmount =
            this.platformFee['platformFeeAmount'].toFixed(2);
          this.roundOffAmount = this.roundOffAmount.toFixed(3);
          this.totalAmount = this.totalAmount.toFixed(2);
        }
        if (data['wallet_balance'] < this.summary.amount) {
          this.walletPayMessage =
            'You have insufficient balance. Available balance is ₹' +
            data['wallet_balance'];
        } else {
          this.walletPayMessage =
            'Payment using Wallet. ' +
            `&nbsp;₹&nbsp;${this.summary.amount} will be deducted from &nbsp;₹&nbsp;${data['wallet_balance']}`;
          this.isWalletPayment = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onEditButtonClick() {
    this.dialogRef.close({'orderList': this.summary})
  }

  preparePlaceOrderBody(wallet = null) {
    let itemList = [];
    this.summary.itemList.forEach((ele) => {
      itemList.push({
        item_id: ele.id,
        quantity: ele.quantity + ele.parcelQuantity,
        parcel_quantity: ele.parcelQuantity,
      });
    });
    let body = {
      order_list: itemList,
      restaurant_id: this.summary.restaurant_id,
    };
    if (wallet != null) {
      body['wallet'] = wallet;
    }
    if (this.transactionId != '' || this.deliveryAddress != '') {
      body['transaction_id'] = this.transactionId;
      body['address'] = this.deliveryAddress;
    }
    return body;
  }

  onConfirmButtonClick() {
    //this.dialogRef.close({mode: 'wallet'})
    let body = this.preparePlaceOrderBody();
    this.__ordersService.createOrders(body).subscribe(
      (data) => {
        console.log('Payment done', data);
        sessionStorage.setItem('transaction_id', data['transaction_id']);
        sessionStorage.setItem('order_no', data['order_no']);
        this.dialog.open(SuccessMsgDialogComponent, {
          data: { msg: 'Your Order number is: ' + data['order_no'] },
        });
        this.dialogRef.close({ mode: 'wallet' });
      },
      (error) => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: error.error.description },
        });
        console.log('Error while paying: ', error.error.description);
      }
    );
  }

  onProceedPaymentClick() {
    let body = this.preparePlaceOrderBody(false);

    this.__ordersService.createOrders(body).subscribe(
      (data) => {
        sessionStorage.setItem('transaction_id', data['transaction_id']);
        sessionStorage.setItem('order_no', data['order_no']);
        sessionStorage.setItem('redirectURL', '/user/myorders');
        window.location.href = data['payment_url'];
      },
      (error) => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: error.error.description },
        });
        console.log('Error while paying: ', error);
      }
    );
    this.dialogRef.close({ mode: 'payment' });
  }

  onProceedPayViaVPAClick() {
    let body = this.preparePlaceOrderBody();

    this.__ordersService.createEcomOrders(body).subscribe(
      data => {
        let successDialogRef = this.dialog.open(SuccessMsgDialogComponent, {
          data: { msg: 'Your Order id is: ' + data['order_id'] },
        });
        successDialogRef.afterClosed().subscribe(
          data => {
            this.dialogRef.close()
            this._router.navigate(['/user/myorders'])
          }
        )
      },
      error => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: error.error.description },
        });
      }
    );
  }

  onProceedwithWalletClick() {
    let body = this.preparePlaceOrderBody(true);
    this.__ordersService.createOrders(body).subscribe(
      (data) => {
        console.log('Payment done', data);
        sessionStorage.setItem('transaction_id', data['transaction_id']);
        sessionStorage.setItem('order_no', data['order_no']);
        this.dialog.open(SuccessMsgDialogComponent, {
          data: { msg: 'Your Order number is: ' + data['order_no'] },
        });
        this.dialogRef.close({ mode: 'wallet' });
      },
      (error) => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: error.error.description },
        });
        console.log('Error while paying: ', error.error.description);
      }
    );
  }

  checkValue() {
    console.log('pay by check wallet check', this.paybyWalletCheck);
  }

  addItem(item) {
    console.log('Add item: ', item);
    let itemAdded = this.summary.itemList.find((x) => x.id == item.id);
    console.log('item added: ', itemAdded, this.summary.itemList);
    if (itemAdded) {
      itemAdded.quantity += 1;
      this.summary.amount += itemAdded.price;
    } else {
      item.quantity += 1;
      this.summary.amount += item.price;
      this.summary.itemList.push(item);
    }
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
    if (this.summary.itemList.length == 0) {
      this.dialogRef.close({'orderList': this.summary})
    }
  }

  incrementParcelQuantity(item) {
    item.parcelQuantity += item.quantity;
    item.quantity = 0;
    this.summary.amount += ( this.parcelCharges * item.parcelQuantity)
  }

  subParcelItem(item) {
    if (item.parcelQuantity > 0) {
      item.parcelQuantity -= 1;
      this.summary.amount -= item.price;
      this.summary.amount -= this.parcelCharges
    }
    if (item.quantity == 0 && item.parcelQuantity == 0) {
      this.summary.itemList = this.summary.itemList.filter(
        (x) => x.id != item.id
      );
    }
    if (this.summary.itemList.length == 0) {
      this.dialogRef.close({'orderList': this.summary})
    }
  }

  addParcelItem(item) {
    console.log('Parcel: ', item);
    let itemAdded = this.summary.itemList.find((x) => x.id == item.id);
    if (!itemAdded) {
      this.summary.itemList.push(item);
      this.summary.amount += this.parcelCharges
    }
    if (item.parcelQuantity < 10) {
      item.parcelQuantity += 1;
      this.summary.amount += item.price;
      this.summary.amount += this.parcelCharges
    }
  }

  calculateItemAmount(item) {
    return item.price * (item.quantity + item.parcelQuantity);
  }

  clearItem(item) {
    console.log(item);
    this.summary.itemList
      .filter((x) => x.id == item.id)
      .forEach((ele) => {
        this.summary.amount -= (ele.quantity * ele.price) + (ele.parcelQuantity * (ele.price + this.parcelCharges)) ;
        ele.quantity = 0;
        ele.parcelQuantity = 0;
      });
    this.summary.itemList = this.summary.itemList.filter(
      (x) => x.id != item.id
    );

    if (this.summary.itemList.length == 0) {
      this.dialogRef.close({'orderList': this.summary})
    }
  }

  getGrandTotalAmount() {
    return this.summary.amount;
  }

  getUPILink() {
    return `upi://pay?pa=${this.upiId}&pn=sender&cu=INR&am=${this.summary.amount}`;
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar('UPI id copied to clipboard')
  }

  openSnackBar(msg: string, action: string='', duration=3000) {
    this._snackBar.open(msg, action, {duration: duration})
  }
}
