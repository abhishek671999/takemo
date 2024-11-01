import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-add-payment-dialog',
  templateUrl: './add-payment-dialog.component.html',
  styleUrls: ['./add-payment-dialog.component.css']
})
export class AddPaymentDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private __fb: FormBuilder,
    private __expenseService: ExpenseService,
    private __vendorService: VendorService,
    private meUtility: meAPIUtility
  ) { }

  public vendorList = [];
  public expenses;
  totalAmount
  totalBalanceAmount

  partialExpenseForm = this.__fb.group({
    vendor_id: ["", Validators.required],
    amount: ["", Validators.required]
  })

  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('restaurant_id', restaurant['restaurant_id']);
        this.__vendorService.getVendor(httpParams).subscribe(
          (data) => {
            this.vendorList = data['vendors'];
          },
          (error) => {
            alert('Failed to fetch vendors');
          }
        );
      }
    )
  }

  addPartialPayment() {
    let body = {
       "vendor_id": this.partialExpenseForm.value.vendor_id,
        "amount": this.partialExpenseForm.value.amount
    }
    this.__expenseService.addPartitalPayment(body).subscribe(
      data => {
        this.partialExpenseForm.reset();
        this.ngOnInit()
      },
      error => {
        alert('Failed to add payment')
      }
    )
  }

  fetchExpenses() {
    let body = this.data.body
    
    if (body) {
      body['vendor_id'] = this.partialExpenseForm.value.vendor_id
      body['paid'] = false
      this.__expenseService.getExpenses(body).subscribe(
        (data) => {
          console.log('Fetched expense: ', data);
          this.expenses = data['expenses'];
          this.expenses.forEach((exp) => {
            exp['created_at'] = new Date(exp.created_at)
              .toLocaleString()
          });
          this.totalAmount = data['total_amount'];
          this.totalBalanceAmount = data['total_balance_amount']
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
    }
  }
  isAmountPaidInvalid() {
    return this.partialExpenseForm.value.amount > this.totalBalanceAmount
  }
}
