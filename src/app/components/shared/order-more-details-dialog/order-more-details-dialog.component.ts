import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, Observable, throwError } from 'rxjs';
import { InputPasswordDialogComponent } from '../input-password-dialog/input-password-dialog.component';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { ErrorMsgDialogComponent } from '../error-msg-dialog/error-msg-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { SuccessMsgDialogComponent } from '../success-msg-dialog/success-msg-dialog.component';

@Component({
  selector: 'app-order-more-details-dialog',
  templateUrl: './order-more-details-dialog.component.html',
  styleUrls: ['./order-more-details-dialog.component.css'],
  
})
export class OrderMoreDetailsDialogComponent {

  constructor(
    private matdialog: MatDialog,
    private meUtility: meAPIUtility,
    @Inject(MAT_DIALOG_DATA) public data,
    private restaurantService: RestaurantService,
    private orderService: OrdersService,
    private dialogRef: MatDialogRef<OrderMoreDetailsDialogComponent>
  ){
    console.log('Data recerived: ', data)
    this.meUtility.getRestaurant().subscribe(
      (data: any) => {
        this.restaurantId = data['restaurant_id']
        this.allowOrderEdit = data['allow_edit_order']
      }
    )
  }
  public restaurantId!: number
  public allowOrderEdit = false
  NA = 'NA'
  closeDialog(){
    this.dialogRef.close()
  }

  deleteOrder(){
    this.verifyPassword()
      .subscribe(
        (data: any) => {
          if(data?.validated){
            let body = {
              'order_id': this.data.order_id
            }
            this.orderService.deleteOrder(body).subscribe(
              (data: any) => {
                this.matdialog.open(SuccessMsgDialogComponent, {data: {msg: 'Order deleted successfully'}})
                this.dialogRef.close({refresh: true})
              },
              (error: any) => {
                this.matdialog.open(ErrorMsgDialogComponent, {data: {msg: 'Something went wrong'}})
              }
            )
          }
        },
      )
  }

  verifyPassword(){
    let verifyPasswordObserver = new Observable((observer) => {
      let dialogRef = this.matdialog.open(InputPasswordDialogComponent)
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.password){
            let body = {
              "restaurant_id": this.restaurantId,
              "password": data.password
            }
            this.restaurantService.validatePassword(body).subscribe(
              (data: any) => {
                observer.next({validated: true})
              },
              (error: any) => {
                observer.next({validated: false})
              }
            )
          }else{
            observer.next({validated: false})
          }
        },
    )
    })
    return verifyPasswordObserver
  }

}
