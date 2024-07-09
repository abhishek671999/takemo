import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timeInterval } from 'rxjs';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import { sessionWrapper } from 'src/app/shared/site-variable';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { AddPaymentDialogComponent } from '../../dialogbox/add-payment-dialog/add-payment-dialog.component';
import { AddExpenseDialogComponent } from '../../dialogbox/add-expense-dialog/add-expense-dialog.component';
import { EditExpenseDialogComponent } from '../../dialogbox/edit-expense-dialog/edit-expense-dialog.component';
import { PageEvent } from '@angular/material/paginator';

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
    private __dialog: MatDialog
  ) {}
  public vendorList = [];
  public expenses = [];
  restaurantId = this.__sessionWrapper.getItem('restaurant_id');

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

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
  public totalPaidAmount = 0;
  public totalBalanceAmount = 0;

  ngOnInit() {
    this.fetchVendorList().then((resolve) => {
      this.fetchExpenses();
    });
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

  prepareFetchExpenseBody() {
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
    return body
  }

  fetchExpenses() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', this.pageIndex * this.pageSize);
    httpParams = httpParams.append(
      'limit',
      this.pageIndex * this.pageSize + this.pageSize
    );
    let body = this.prepareFetchExpenseBody()
    if (body) {
      this.__expenseService.getExpenses(body, httpParams).subscribe(
        (data) => {
          console.log('Fetched expense: ', data);
          this.expenses = data['expenses'];
          this.length = data['no_of_records']
          this.expenses.forEach((exp) => {
            exp['created_at'] = new Date(exp.created_at)
              .toLocaleString()
          });
          this.totalAmount = data['total_amount'];
          this.totalBalanceAmount = data['total_balance_amount']
          this.totalPaidAmount = data['total_paid_amount']
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
    }
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

  
  openAddExpenseDialog() {
    let dialogRef = this.__dialog.open(AddExpenseDialogComponent)
    dialogRef.afterClosed().subscribe(
      data => this.ngOnInit()
    )
  }

  openAddPaymentDialog() {
    let dialogRef = this.__dialog.open(AddPaymentDialogComponent, {data: {body: this.prepareFetchExpenseBody()}})
    dialogRef.afterClosed().subscribe(
      data => this.ngOnInit()
    )
  }

  openEditExpenseDialog(expense) {
    let dialogRef = this.__dialog.open(EditExpenseDialogComponent, { data: expense })
    dialogRef.afterClosed().subscribe(
      data => this.ngOnInit()
    )
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchExpenses();
  }
}
