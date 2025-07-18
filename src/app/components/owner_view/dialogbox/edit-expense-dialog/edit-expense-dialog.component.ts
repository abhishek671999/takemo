import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from 'src/app/components/shared/confirm-action-dialog/confirm-action-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { dateUtils } from 'src/app/shared/utils/date_utils';

@Component({
  selector: 'app-edit-expense-dialog',
  templateUrl: './edit-expense-dialog.component.html',
  styleUrls: ['./edit-expense-dialog.component.css']
})
export class EditExpenseDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public expense,
    private __expenseService: ExpenseService,

    private __matDialog: MatDialog,
    private dialogRef: MatDialogRef<EditExpenseDialogComponent>,
    private __datetimeUtils: dateUtils,
    private meUtility: meAPIUtility
  ) {}

  updatedPaidAmount = 0
  private restaurantId: number
  public expenseData = []
  public showMoreInfo = false;
  
  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.fetchExpenseLogs()
      }
    )
  }

  fetchExpenseLogs(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('expense_id', this.expense.expense_id)
    this.__expenseService.getExpenseLogs(httpParams).subscribe(
      data => {
        this.expenseData = data['expense_logs']
        this.expenseData.forEach(expense => {
        expense['datetime'] = this.__datetimeUtils.getStandardizedDateTimeFormate(new Date(expense['datetime']))
          console.log(expense['datetime'])
        })
      },
      error => console.log(error)
    )
  }

  editExpense() {
    let body = {   
      "expense_id": this.expense.expense_id,
      "vendor_id": this.expense.vendor_id,
      "amount": this.expense.amount,
      "amount_paid": Number(this.updatedPaidAmount) + this.expense.amount_paid,
      "restaurant_id": this.restaurantId
  }
    this.__expenseService.editExpense(body).subscribe(
      data => {
        this.__matDialog.open(SuccessMsgDialogComponent, { data: { msg: 'Expense updated successfully' } })
        this.dialogRef.close()
      },
      error => alert('Failed to update')
    )
  }

  isAmountPaidInvalid() {
    return this.updatedPaidAmount > (this.expense.amount - this.expense.amount_paid) 
  }

  deleteExpense() {
    let dialogRef = this.__matDialog.open(ConfirmActionDialogComponent, { data: `Are you sure want to delete this expense??` })
    dialogRef.afterClosed().subscribe(data =>
    {
      if (data['select']) {
        let body = {
          expense_id: this.expense.expense_id
        }
        this.__expenseService.deleteExpense(body).subscribe(
          data => {
            this.__matDialog.open(SuccessMsgDialogComponent, { data: { msg: 'Expense delete successfully' } })
            this.dialogRef.close()
          },
          error => alert('Failed to delete')
        )
      }
    }
    )
  }

  showMoreExpenseInfo() {
    
  }

  close() {
    this.dialogRef.close()
  }
}
