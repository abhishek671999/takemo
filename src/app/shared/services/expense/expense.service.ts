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
  private __payAllExpensesOfVendorEndpoint = 'expense/pay_all_expenses_of_vendor/'
  private __EditExpenseEndpoint = 'expense/edit_expense/'

  constructor(private __httpClient: HttpClient) { }
  
  getExpenses(httpParams: HttpParams) {
    return this.__httpClient.get(host + this.__getExpenseEndpoint, {params: httpParams})
  }

  addExpense(body) {
    return this.__httpClient.post(host + this.__addExpenseEndpoint , body)
  }

  payAllExpensesOfVendor(body) {
    return this.__httpClient.post(host + this.__payAllExpensesOfVendorEndpoint, body)
  }

  editExpense(body) {
    return this.__httpClient.post(host + this.__EditExpenseEndpoint, body)
  }
}
