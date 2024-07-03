import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from 'src/app/components/shared/confirm-action-dialog/confirm-action-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-edit-expense-dialog',
  templateUrl: './edit-expense-dialog.component.html',
  styleUrls: ['./edit-expense-dialog.component.css']
})
export class EditExpenseDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public expense,
    private __expenseService: ExpenseService,
    private __sessionWrapper: sessionWrapper,
    private __matDialog: MatDialog,
    private dialogRef: MatDialogRef<EditExpenseDialogComponent>
  ) {}

  updatedPaidAmount = 0
  private restaurantId = this.__sessionWrapper.getItem('restaurant_id')

  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('expense_id', this.expense.expense_id)
    this.__expenseService.getExpenseLogs(httpParams).subscribe(
      data => console.log('expense log: ', data),
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

  close() {
    this.dialogRef.close()
  }
}
