import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent {

  displayedColumns: string[] = [
    'Sl_no',
    'Date',
    'Amount',
    'Type',
    'Status',
    'Transaction_ID',
  ];
  WalletTransactionHistory = []
  public walletTransactionHistoryDataSource = new MatTableDataSource(this.WalletTransactionHistory);

} 
