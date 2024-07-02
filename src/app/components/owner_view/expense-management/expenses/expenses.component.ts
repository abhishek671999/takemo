import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timeInterval } from 'rxjs';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import { sessionWrapper } from 'src/app/shared/site-variable';
import { dateUtils } from 'src/app/shared/utils/date_utils';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent {
  constructor(
    private __expenseService: ExpenseService,
    private __vendorService: VendorService,
    private __fb: FormBuilder,
    private __snackbar: MatSnackBar,
    private __sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
  ) {}
  public vendorList = [];
  public expenses = [];
  restaurantId = this.__sessionWrapper.getItem('restaurant_id');

  partialExpenseForm = this.__fb.group({
    vendor_id: ["", Validators.required],
    amount: ["", Validators.required]
  })

  expensesForm = this.__fb.group({
    vendor_id: ['', [Validators.required]],
    total_amount: ['', [Validators.required]],
    paid_amount: ['', Validators.required],
    description: ['']
  });

  isPaidOptions = [
    { actualValue: 'True', displayValue: 'Paid' },
    { actualValue: 'False', displayValue: 'Unpaid' },
  ];
  public defaultVendor = { id: null, name: 'All' };
  public selectedVendor = this.defaultVendor;

  timeFramesForExpenses = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 6 months', actualValue: 'last_6_months' },
    { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' },
  ];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  selectedTimeFrameForExpenses: string = this.timeFramesForExpenses[0].actualValue

  public defaultPaidOption = { actualValue: null, displayValue: 'All' };
  public selectedPaidOption = this.defaultPaidOption;

  public totalAmount = 0;

  ngOnInit() {
    this.fetchVendorList().then((resolve) => {
      this.fetchExpenses();
    });
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

  fetchVendorList() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('restaurant_id', this.restaurantId);
    return new Promise((resolve, reject) => {
      this.__vendorService.getVendor(httpParams).subscribe(
        (data) => {
          this.vendorList = data['vendors'];
          resolve(this.vendorList);
        },
        (error) => {
          alert('Failed to fetch vendors');
          reject(error);
        }
      );
    });
  }

  fetchExpenses() {
    let body = {
      "restaurant_id": Number(this.restaurantId),
    };
    if (this.selectedPaidOption.actualValue) {
        body['paid'] = this.selectedPaidOption.actualValue
    }
    if (this.selectedVendor.id) {
      body['vendor_id'] = this.selectedVendor.id;
    }
    if (this.selectedTimeFrameForExpenses == 'custom') {
      if (this.range.value.start && this.range.value.end) {
        body['time_frame'] = this.selectedTimeFrameForExpenses;
        body['start_date'] = this.dateUtils.getStandardizedDateFormate(
          this.range.value.start
        );
        body['end_date'] = this.dateUtils.getStandardizedDateFormate(
          this.range.value.end
        );
      } else {
        body = null;
      }
    } else {
      body['time_frame'] = this.selectedTimeFrameForExpenses;
    }
    if (body) {
      this.__expenseService.getExpenses(body).subscribe(
        (data) => {
          console.log('Fetched expense: ', data);
          this.expenses = data['expenses'];
          this.expenses.forEach((exp) => {
            exp['created_at'] = new Date(exp.created_at)
              .toLocaleString()
          });
          this.totalAmount = data['total_amount'];
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
    }
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
        this.ngOnInit();
        this.expensesForm.reset();
        this.expensesForm.markAsUntouched();
        this.expensesForm.markAsPristine();
        this.__snackbar.open('Expense added', 'Dismiss', { duration: 2000 });
      },
      (error) => {
        console.log('Error while adding expense: ', error);
      }
    );
  }

  markAllExpensePaid() {
    let body = {
      vendor_id: this.selectedVendor.id,
    };
    this.__expenseService.payAllExpensesOfVendor(body).subscribe(
      (data) => {
        this.__snackbar.open(
          `Marked paid for vendor ${this.selectedVendor.name}`,
          'dismiss',
          { duration: 2000 }
        );
        this.ngOnInit();
      },
      (error) => {
        this.__snackbar.open(
          `Failed to mark. Error ${error.error.description}`,
          'dismiss',
          { duration: 2000 }
        );
      }
    );
  }

  markExpensePaid(expense) {
    let body = {
      expense_id: expense.expense_id,
      vendor_id: expense.vendor_id,
      amount: expense.amount,
      paid: !expense.paid,
      restaurant_id: this.restaurantId,
    };
    this.__expenseService.editExpense(body).subscribe(
      (data) => {
        expense.paid = !expense.paid;
      },
      (error) => {
        this.__snackbar.open('Failed to update', 'dismiss', { duration: 2000 });
      }
    );
  }
}
