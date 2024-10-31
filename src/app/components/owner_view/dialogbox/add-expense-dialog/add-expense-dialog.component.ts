import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.css']
})
export class AddExpenseDialogComponent {

  constructor(
    private __fb: FormBuilder,
    private __expenseService: ExpenseService,
    private __vendorService: VendorService,
    private meUtility: meAPIUtility,
    private __dialogRef: MatDialogRef<AddExpenseDialogComponent>
  ) { }

  public vendorList = [];
  restaurantId: number;

  expensesForm = this.__fb.group({
    vendor_id: ['', [Validators.required]],
    total_amount: ['', [Validators.required]],
    paid_amount: ['', Validators.required],
    description: ['']
  });

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

  addExpense() {
    let body = {
      vendor_id: this.expensesForm.value.vendor_id,
      amount: this.expensesForm.value.total_amount,
      amount_paid: this.expensesForm.value.paid_amount,
      // paid: this.expensesForm.value.paid,
      restaurant_id: this.restaurantId,
      description: this.expensesForm.value.description
    };
    this.__expenseService.addExpense(body).subscribe(
      (data) => {
        console.log('Added expense: ', data);
        this.__dialogRef.close()
      },
      (error) => {
        console.log('Error while adding expense: ', error);
      }
    );
  }

}
