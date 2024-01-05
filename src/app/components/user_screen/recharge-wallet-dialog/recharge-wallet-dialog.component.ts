import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentsService } from 'src/app/shared/services/payments/payments.service';

@Component({
  selector: 'app-recharge-wallet-dialog',
  templateUrl: './recharge-wallet-dialog.component.html',
  styleUrls: ['./recharge-wallet-dialog.component.css']
})
export class RechargeWalletDialogComponent {
    constructor(
      @Inject(MAT_DIALOG_DATA) private data,
      private _paymentService: PaymentsService,
      private _formBuilder: FormBuilder,
      private dialogRef: MatDialogRef<RechargeWalletDialogComponent>
    ){}

    rechargeForm = this._formBuilder.group({
      amount: ['', Validators.required]
    })

    rechargeWallet(){
      let body = {
        amount: this.rechargeForm.value.amount
      }
      this._paymentService.rechargeWallet(body).subscribe(
        data => {
          console.log(data)
          sessionStorage.setItem('transaction_id', data['transaction_id'])
          sessionStorage.setItem('redirectURL', '/user/wallet')
          window.location.href = data['payment_url']
        },
        error => {
          console.log('error occured')
          this.dialogRef.close({ success: 'failed', msg: error.error.error})
        }
      )
    }

    closeDialog(){
      this.dialogRef.close()
    }
}
