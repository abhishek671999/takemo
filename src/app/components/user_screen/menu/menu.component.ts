import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  amount: number = 0;
  orderList = { items: [], amount: 0, restaurant_id: null };
  constructor(
    private _menuService: MenuService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _orderService: OrdersService
  ) {}

  menu_response: any;
  showSpinner = true;
  restaurant_id: number;

  ngOnInit() {
    this.showSpinner = true;
    this._route.paramMap.subscribe((params: ParamMap) => {
      this.restaurant_id = parseInt(params.get('id'));
      this._menuService.getMenu(this.restaurant_id).subscribe(
        (data) => {
          (this.menu_response = data), console.log(this.menu_response);
          this.menu_response.menu.forEach((category) => {
            category.category.items.filter(
              (element) => element.is_available == 1
            );
          });
          this.setQuantity();
        },
        (error) => console.log('Error while getting menu: ', error)
      );
    });

    this.showSpinner = false;
  }

  setQuantity() {
    console.log('Setting quantity:', this.menu_response);
    this.menu_response.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        item.quantity = 0;
      });
    });
  }

  addItem(item) {
    if (item.quantity < 3) {
      item.quantity += 1;
      this.amount += item.price;
    }
  }
  subItem(item) {
    if (item.quantity > 0) {
      item.quantity -= 1;
      this.amount -= item.price;
    }
  }

  prepareSummary() {
    this.menu_response.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        if (item.quantity) {
          let itemSummary = {
            item_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          };
          this.orderList.items.push(itemSummary);
        }
      });
    });
    this.orderList.amount = this.amount;
    this.orderList.restaurant_id = this.restaurant_id;
    console.log(this.orderList);
    let dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: this.orderList,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Result from dialog component: ', result);
      if (result) {
        console.log(result);
        this.orderList = { items: [], amount: 0, restaurant_id: null };
      } else {
        this.orderList = { items: [], amount: 0, restaurant_id: null };
      }
    });
  }
}
