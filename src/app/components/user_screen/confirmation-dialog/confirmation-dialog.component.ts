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

  ngOnInit(){
    this.__ordersService.checkIfPaymentRequired().subscribe(
      data => {
        (console.log(data))
        this.isPayment = data['payment_required']
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
  localStorage.setItem('total_amount', this.pickedItems.amount)
  
    this.__ordersService.createOrders(body).subscribe(
      data => {
        console.log('Payment done', data)
        localStorage.setItem('transaction_id', data['transaction_id'])
        localStorage.setItem('order_id', data['order_id'])
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
  localStorage.setItem('total_amount', this.pickedItems.amount)
  
    this.__ordersService.createOrders(body).subscribe(
      data => {
        console.log('Payment done', data)
        localStorage.setItem('transaction_id', data['transaction_id'])
        localStorage.setItem('order_id', data['order_id'])
        window.location.href = data['payment_url']
      },
      error => {
        console.log('Error while paying: ', error)
      }
    )
    this.dialogRef.close({mode: 'payment'})
  }

}
