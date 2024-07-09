import { Injectable } from '@angular/core';
import { VendorService } from '../vendor/vendor.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { host } from '../../site-variable';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private __getExpenseEndpoint = 'expense/get_expenses/'
  private __addExpenseEndpoint = 'expense/add_expense/'
  private __addPartialPaymentEndpoint = 'expense/partial_pay_expenses_of_vendor/'
  private __payAllExpensesOfVendorEndpoint = 'expense/pay_all_expenses_of_vendor/'
  private __EditExpenseEndpoint = 'expense/edit_expense/'
  private __deleteExpenseEndpoint = 'expense/delete_expense/'
  private __getExpenseLogsEndpoint = 'expense/get_expense_logs/'

  constructor(private __httpClient: HttpClient) { }
  
  getExpenses(body, httpParams?) {
    return this.__httpClient.post(host + this.__getExpenseEndpoint, body, {params: httpParams})
  }

  getExpenseLogs(httpParams: HttpParams) {
    return this.__httpClient.get(host + this.__getExpenseLogsEndpoint, {params: httpParams})
  }

  addExpense(body) {
    return this.__httpClient.post(host + this.__addExpenseEndpoint , body)
  }

  addPartitalPayment(body) {
    return this.__httpClient.post(host + this.__addPartialPaymentEndpoint, body)
  }

  payAllExpensesOfVendor(body) {
    return this.__httpClient.post(host + this.__payAllExpensesOfVendorEndpoint, body)
  }

  editExpense(body) {
    return this.__httpClient.post(host + this.__EditExpenseEndpoint, body)
  }

  deleteExpense(body) {
    return this.__httpClient.delete(host + this.__deleteExpenseEndpoint, {body: body})
  }
}
