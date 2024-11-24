import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { InputPasswordDialogComponent } from '../input-password-dialog/input-password-dialog.component';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { ErrorMsgDialogComponent } from '../error-msg-dialog/error-msg-dialog.component';

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
    private dialogRef: MatDialogRef<OrderMoreDetailsDialogComponent>
  ){
    console.log('Data recerived: ', data)
    this.meUtility.getRestaurant().subscribe(
      (data: any) => {
        this.restaurantId = data['restaurant_id']
      }
    )
  }
  public restaurantId!: number
  NA = 'NA'
  closeDialog(){
    this.dialogRef.close()
  }

  deleteOrder(){
    this.verifyPassword().subscribe(
      (data: any) => {
        if(data?.validated){
          console.log('Deleted order') // todo: put api call here
        }else{
          this.matdialog.open(ErrorMsgDialogComponent, {data: {msg: 'Incorrect password'}})
        }
      },
      (error: any) => {
        console.log('this is error: ', error)
        this.matdialog.open(ErrorMsgDialogComponent, {data: {msg: 'Incorrect password'}})
      }
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
