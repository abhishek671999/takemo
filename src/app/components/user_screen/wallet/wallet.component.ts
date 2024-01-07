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
    'effective_balance',
    'Transaction_ID',
    'UTR'
  ];
  WalletTransactionHistory = []

  currentWalletBalance = 0
  public walletTransactionHistoryDataSource = new MatTableDataSource(this.WalletTransactionHistory);

  ngOnInit(){
    this.paymentService.getWalletDetails().subscribe(
      data => {
        console.log(data)
        this.currentWalletBalance = data['wallet_balance']
        data['recharges'].forEach(element => {
          this.WalletTransactionHistory.push(
            {'date': new Date(element.recharge_time).toLocaleString(), 
            'amount': element.recharge_amount, 
            'transaction_id': element.transaction_id,
            'effective_balance': element.wallet_balance,
            'utr': element.UTR

          })          
        });
        this.walletTransactionHistoryDataSource.data = this.WalletTransactionHistory
        console.log(this.WalletTransactionHistory)
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
