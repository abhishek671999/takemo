import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RechargeWalletDialogComponent } from '../recharge-wallet-dialog/recharge-wallet-dialog.component';
import { PaymentsService } from 'src/app/shared/services/payments/payments.service';
import { SuccessMsgDialogComponent } from '../../shared/success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from '../../shared/error-msg-dialog/error-msg-dialog.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent {

  constructor(private matDialog: MatDialog, private paymentService: PaymentsService){}

  displayedColumns: string[] = [
    'Sl_no',
    'Date',
    'Amount',
    'Type',
    'Status',
    'Transaction_ID',
  ];
  WalletTransactionHistory = []

  currentWalletBalance = 0
  public walletTransactionHistoryDataSource = new MatTableDataSource(this.WalletTransactionHistory);

  ngOnInit(){
    this.paymentService.getWalletDetails().subscribe(
      data => {
        this.currentWalletBalance = data['wallet_balance']
        data['recharges'].forEach(element => {
          this.WalletTransactionHistory.push({'date': element.date, 'amount': element.amount, 'type': element.type, 'status': element.status, 'transaction_id': element.transaction_id})          
        });
        this.walletTransactionHistoryDataSource.data = this.WalletTransactionHistory
      },
      error => {
        console.log('Error while loading wallet details')
      }
    )
  }

  openRechargeDialog(){
    let dialogRef = this.matDialog.open(RechargeWalletDialogComponent)
    this.handlePostDialogClosure(
      dialogRef,
      'Successfully edited the rule',
      'Failed to edit rule. Please contact Takemo'
    );
  }

  handlePostDialogClosure(dialogRef, successMsg, errorMsg) {
    dialogRef.afterClosed().subscribe(
      (data) => {
        console.log('Edit rule close with: ', data);
        if (data == undefined) {
          console.log('Nothing');
        } else if (data.success == 'ok') {
          this.showSuccessDialog(successMsg);
        } else if (data.success == 'failed') {
          if(data.msg){
            this.showErrorDialog(data.msg)
          }else{
            this.showErrorDialog(errorMsg);
          }

        }
      },
      (error) => {
        console.log('Error while clsoing edit rule: ', error);
        this.showErrorDialog(errorMsg);
      }
    );
  }

  showSuccessDialog(msg: string) {
    let dialogRef = this.matDialog.open(SuccessMsgDialogComponent, {
      data: { msg: msg },
    });
    setTimeout(() => {
      dialogRef.close();
    }, 1500);
    this.ngOnInit();
  }

  showErrorDialog(msg: string) {
    let dialogRef = this.matDialog.open(ErrorMsgDialogComponent, {
      data: { msg: msg },
    });
    setTimeout(() => {
      dialogRef.close();
    }, 8000);
  }
} 
