import { Component, Inject, ViewChild } from '@angular/core';
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
import { MeService } from 'src/app/shared/services/register/me.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from 'src/app/shared/site-variable';
import { cartConnectService } from 'src/app/shared/services/connect-components/connect-components.service';
import { ParcelDialogComponent } from '../parcel-dialog/parcel-dialog.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  @ViewChild('confirmOrderButton') confirmOrderButton: any;
  @ViewChild('proceedToPayButton') proceedToPayButton: any;
  @ViewChild('payViaVPAButton') payViaVPAButton: any;
  @ViewChild('payViaWalletButton') payViaWalletButton: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private __ordersService: OrdersService,
    private dialog: MatDialog,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private meService: MeService,
    private _fb: FormBuilder,
    private _tableService: TablesService,
    private __sessionWrapper: sessionWrapper,
    private __cartService: cartConnectService,
  ) {
    console.log(data)
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
  showQRcode = false;
  public otpValidated = false;
  public payOnDelivery = false;
  public isApiLoaded = false

  // public upiId = 'pascitopcprivatelimited.ibz@icici';
  public upiId = '8296577900@ibl';
  public parcelCharges = 5; // hardcode
  public otpRequired

  public transactionForm = this._fb.group({
    transactionId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    addresss: ['', [Validators.required, Validators.minLength(4)]]
  })

  public otpForm = this._fb.group({
    otp: ['', [Validators.required]]
  })

  ngOnInit() {
    this.dialogRef.updateSize('100%')
    this.meService.getMyInfo().subscribe((data) => {
      this.transactionForm.setValue({
        'transactionId': '',
        'addresss': data['address']
      })
    });
    this.totalAmount = this.data.summary.amount;
    this.restaurantParcel = this.data.summary.restaurant_parcel;
    this.dialogRef.disableClose = true;
    this.dialogRef.updateSize('auto', 'auto');
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'restaurant_id',
      this.__sessionWrapper.getItem('restaurant_id')
    );
    httpParams = this.data.summary.table_id? httpParams.append('table_id', this.data.summary.table_id): httpParams
    this.__ordersService.checkIfPaymentRequired(httpParams).subscribe(
      (data) => {
        console.log(data);
        this.isPayment = data['payment_required'];
        this.isApiLoaded = true
        this.otpRequired = data['otp_required'] ? data['otp_required'] : false
        this.otpValidated = data['otp_required'] ? !data['otp_required'] : false
        this.payOnDelivery = this.__sessionWrapper.getItem('pay_on_delivery') ? this.__sessionWrapper.getItem('pay_on_delivery').toLowerCase() == 'true': false //data['pay_on_delivery']? data['pay_on_delivery'] : false
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
        if (data['wallet_balance'] < this.data.summary.amount) {
          this.walletPayMessage =
            'You have insufficient balance. Available balance is ₹' +
            data['wallet_balance'];
        } else {
          this.walletPayMessage =
            'Payment using Wallet. ' +
            `&nbsp;₹&nbsp;${this.data.summary.amount} will be deducted from &nbsp;₹&nbsp;${data['wallet_balance']}`;
          this.isWalletPayment = true;
        }
      },
      (error) => {
        console.log(error);
        alert(error.error)
      }
    );
  }

  onEditButtonClick() {
    this.dialogRef.close({ orderlist: this.data.summary });
  }

  preparePlaceOrderBody(wallet = null) {
    this.data.summary.itemList.forEach(item => {
      item.item_id = item.id
    })
    let body = {
      order_list: this.data.summary.itemList,
      restaurant_id: this.data.summary.restaurant_id,
    };
    if (wallet != null) {
      body['wallet'] = wallet;
    }
    if (this.transactionForm.value.transactionId != '' || this.transactionForm.value.addresss != '') {
      body['transaction_id'] = this.transactionForm.value.transactionId;
      body['address'] = this.transactionForm.value.addresss;
    }
    if (this.data.summary.table_id) {
      body['table_id'] = this.data.summary.table_id
    }
    if (this.payOnDelivery) {
      body['payment_mode'] = "pay_on_delivery"
    }
    return body;
  }

  onConfirmButtonClick() {
    if(this.confirmOrderButton) this.confirmOrderButton._elementRef.nativeElement.disabled = true
      let body = this.preparePlaceOrderBody();
      this.__ordersService.createOrders(body).subscribe(
        (data) => {
          console.log('Payment done', data);
          sessionStorage.setItem('transaction_id', data['transaction_id']);
          sessionStorage.setItem('order_no', data['order_no']);
          this.clearCart()
          this.dialog.open(SuccessMsgDialogComponent, {
            data: { msg: 'Your Order number is: ' + data['order_no'] },
          });
          this.dialogRef.close({ mode: 'wallet', orderlist: this.data.summary});
        },
        (error) => {
          this.dialog.open(ErrorMsgDialogComponent, {
            data: { msg: error.error.description },
          });
          this.confirmOrderButton._elementRef.nativeElement.disabled = false
        }
      );

  }

  onProceedPaymentClick() {
    if(this.proceedToPayButton) this.proceedToPayButton._elementRef.nativeElement.disabled = true
    let body = this.preparePlaceOrderBody(false);
    debugger
    this.__ordersService.createOrders(body).subscribe(
      (data) => {
        sessionStorage.setItem('transaction_id', data['transaction_id']);
        sessionStorage.setItem('order_no', data['order_no']);
        sessionStorage.setItem('redirectURL', '/user/myorders');
        this.__sessionWrapper.isPaymentDone = data['payment_url'] ? true : false
        this.__sessionWrapper.isKDSEnabled = data['kds']
        this.clearCart()
        this.dialogRef.close({ mode: 'wallet', orderlist: this.data.summary});
        window.location.href = data['payment_url'];
      },
      (error) => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: error.error.description },
        });
        if(this.proceedToPayButton) this.proceedToPayButton._elementRef.nativeElement.disabled = false
      }
    );
    this.dialogRef.close({ mode: 'payment' });
  }

  onProceedPayViaVPAClick() {
    if(this.payViaVPAButton) this.payViaVPAButton._elementRef.nativeElement.disabled = true
      let body = this.preparePlaceOrderBody();
  
      this.__ordersService.createEcomOrders(body).subscribe(
        (data) => {
          this.clearCart()
          let successDialogRef = this.dialog.open(SuccessMsgDialogComponent, {
            data: { msg: 'Your Order id is: ' + data['order_no'] },
          });
          successDialogRef.afterClosed().subscribe((data) => {
            this.dialogRef.close();
            this._router.navigate(['/user/myorders']);
          });
        },
        (error) => {
          this.dialog.open(ErrorMsgDialogComponent, {
            data: { msg: error.error.description },
          });
          if(this.payViaVPAButton) this.payViaVPAButton._elementRef.nativeElement.disabled = false
        }
      );
  }

  onProceedwithWalletClick() {
    if(this.payViaWalletButton) this.payViaWalletButton._elementRef.nativeElement.disabled = true
    let body = this.preparePlaceOrderBody(true);
    this.__ordersService.createOrders(body).subscribe(
        (data) => {
          console.log('Payment done', data);
          sessionStorage.setItem('transaction_id', data['transaction_id']);
          sessionStorage.setItem('order_no', data['order_no']);
          this.clearCart()
          this.dialog.open(SuccessMsgDialogComponent, {
            data: { msg: 'Your Order number is: ' + data['order_no'] },
          });
          this.dialogRef.close({ mode: 'wallet', orderlist: this.data.summary });
        },
        (error) => {
          this.dialog.open(ErrorMsgDialogComponent, {
            data: { msg: error.error.description },
          });
          if(this.payViaWalletButton) this.payViaWalletButton._elementRef.nativeElement.disabled = false
        }
      )
  }

  checkValue() {
    console.log('pay by check wallet check', this.paybyWalletCheck);
  }

  addItem(subItem) {
    debugger
    if(subItem.parcel_available) {
      let dialogRef = this.dialog.open(ParcelDialogComponent, {
        data: {
          item: subItem, orderList: this.data.summary
        }
      })
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.result){
            this.__cartService.setCartItems(this.data.summary)
          }
        }
      )}
      else{
        this.data.addfn(subItem, this.data.item)
      }
  }
  subItem(subItem) {
    if(subItem.parcel_available) {
      let dialogRef = this.dialog.open(ParcelDialogComponent, {
        data: {
          item: subItem, orderList: this.data.summary
        }
      })
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.result){
            this.__cartService.setCartItems(this.data.itemList)
          }
        }
      )}
      else{
        this.data.subfn(subItem, this.data.item)
      }
  }

  incrementParcelQuantity(item) {
    item.parcelQuantity += item.quantity;
    item.quantity = 0;
    this.data.summary.amount += this.parcelCharges * item.parcelQuantity;
  }

  subParcelItem(item) {
    if (item.parcelQuantity > 0) {
      item.parcelQuantity -= 1;
      this.data.summary.amount -= item.price;
      this.data.summary.amount -= this.parcelCharges;
    }
    if (item.quantity == 0 && item.parcelQuantity == 0) {
      this.data.itemList = this.data.itemList.filter(
        (x) => x.id != item.id
      );
    }
    if (this.data.summary.itemList.length == 0) {
      this.dialogRef.close({ orderList: this.data.summary });
    }
  }

  addParcelItem(item) {
    console.log('Parcel: ', item);
    let itemAdded = this.data.summary.itemList.find((x) => x.id == item.id);
    if (!itemAdded) {
      this.data.summary.itemList.push(item);
      this.data.summary.amount += this.parcelCharges;
    }
    if((item.quantity < 30) && (item.inventory_stock ? (item.quantity + item.parcelQuantity) < item.inventory_stock : true)) {
      item.parcelQuantity += 1;
      this.data.summary.amount += item.price;
      this.data.summary.amount += this.parcelCharges;
    }
  }

  calculateItemAmount(item) {
    return item.price * item.quantity;
  }

  clearItem(item) {
    this.data.clearfn(item)
  }

  getGrandTotalAmount() {
    return this.data.summary.amount + this.data.summary.parcel_amount;
  }

  getUPILink() {
    return `upi://pay?pa=${this.upiId}&pn=sender&cu=INR&am=${this.data.summary.amount}`;
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
    this.openSnackBar('UPI id copied to clipboard');
  }

  openSnackBar(msg: string, action: string = '', duration = 3000) {
    this._snackBar.open(msg, action, { duration: duration });
  }

  openQRcode() {
    this.showQRcode = !this.showQRcode;
  }

  validateOTP() {
    let body = {
      'table_id': this.data.summary.table_id,
      'otp': this.otpForm.value.otp
    }
    this._tableService.checkIfOTPValid(body).subscribe(
      data => {
        this.otpValidated = true
      },
      error => {
        alert('Incorrect OTP')
      }
    )
  }

  clearCart() {
    this.data.summary.itemList.forEach(element => {
      element.quantity = 0
      element.parcelQuantity = 0
    });
    this.data.summary.amount = 0
    this.data.summary.parcel_amount = 0
    this.__cartService.setCartItems(this.data.summary)
  }

  placeTableOrder() {
      let body = this.preparePlaceOrderBody(false)
      this.__ordersService.createOrders(body).subscribe(
        data => {
          this.clearCart();
          this.dialog.open(SuccessMsgDialogComponent, {
            data: { msg: 'Your Order number is: ' + data['order_no'] },
          });
          this.dialogRef.close({orderlist: this.data.summary})
        },
        error => {
          this.dialog.open(ErrorMsgDialogComponent, {
            data: { msg: error.error.description },
          });
        }
      )
    }

}
