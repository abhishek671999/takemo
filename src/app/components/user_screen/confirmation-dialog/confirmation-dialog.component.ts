import {Component, Inject} from '@angular/core'
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],

})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public pickedItems, 
  public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  private __ordersService: OrdersService,
  private _router: Router
  ) {
    console.log('Picked items: ', pickedItems)
  }

  public isPayment=false;
  public platformFee = undefined || {};
  public totalAmount;
  public roundOffAmount;
  public platformFeeAmount;

  ngOnInit(){
    this.__ordersService.checkIfPaymentRequired().subscribe(
      data => {
        (console.log(data))
        this.isPayment = data['payment_required']
        this.totalAmount = this.pickedItems.amount
        if(data['tax_inclusive']){
          console.log('INcluding tax')
          this.platformFee['platform_fee_percentage'] = data['platform_fee_percentage']
          this.platformFee['platform_fee_gst_percentage'] = data['platform_fee_gst_percentage']
          this.platformFee['platformFeeAmount'] = ((this.platformFee['platform_fee_percentage'] * this.totalAmount) 
          * (1 + this.platformFee['platform_fee_gst_percentage']))
          this.totalAmount = this.totalAmount + this.platformFee['platformFeeAmount']
          this.roundOffAmount = this.totalAmount.toFixed(2) - this.totalAmount

          this.platformFeeAmount = this.platformFee['platformFeeAmount'].toFixed(2)
          this.roundOffAmount = this.roundOffAmount.toFixed(3)
          this.totalAmount = this.totalAmount.toFixed(2)
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  onEditButtonClick(){
    this.dialogRef.close(false)
  }

  onConfirmButtonClick(){
    //this.dialogRef.close({mode: 'wallet'})
    let body ={   
      "total_amount": this.pickedItems.amount,
      "order_list":this.pickedItems.items,
      "restaurant_id": this.pickedItems.restaurant_id
  }
    sessionStorage.setItem('total_amount', this.totalAmount)
    this.__ordersService.createOrders(body).subscribe(
      data => {
        console.log('Payment done', data)
        sessionStorage.setItem('transaction_id', data['transaction_id'])
        sessionStorage.setItem('order_no', data['order_no'])
        alert('You order number is: '+ data['order_no'])
        this.dialogRef.close({mode: 'wallet'})
      },
      error => {
        console.log('Error while paying: ', error)
      }
    )
    
  }

  onProceedPaymentClick(){
    let body ={   
      "total_amount": this.pickedItems.amount,
      "order_list":this.pickedItems.items,
      "restaurant_id": this.pickedItems.restaurant_id
  }
  sessionStorage.setItem('total_amount', this.pickedItems.amount)
  
    this.__ordersService.createOrders(body).subscribe(
      data => {
        console.log('Payment done', data)
        sessionStorage.setItem('transaction_id', data['transaction_id'])
        sessionStorage.setItem('order_no', data['order_no'])
        window.location.href = data['payment_url']
      },
      error => {
        console.log('Error while paying: ', error)
      }
    )
    this.dialogRef.close({mode: 'payment'})
  }

}
