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
  orderList = { itemList: [], amount: 0, restaurant_id: null };
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
  menu;
  hideCategory = true
  currentCategory = null;
  ngOnInit() {
    this.showSpinner = true;
    this._route.paramMap.subscribe((params: ParamMap) => {
      this.restaurant_id = parseInt(params.get('id'));
      this._menuService.getMenu(this.restaurant_id).subscribe(
        (data) => {
          this.menu_response = data
          this.menu = data['menu']
          console.log('Menu response', data);
          this.menu.map((category) => {
            category.category.items.filter(
              (element) => element.is_available == true
            );
          });
          this.setQuantity();
          this.showSpinner = false;
          this.showOnlyFirstCategory();
        },
        (error) => {
          console.log('Error while getting menu: ', error)
          this.showSpinner = false;
          alert('Error while loading menu')
        }
      );
    });    
  }

  setQuantity() {
    console.log('Setting quantity:', this.menu_response);
    this.menu.forEach((category) => {
      category.category.items.forEach((item) => {
        item.quantity = 0;
        item.parcelQuantity = 0;
      });
    });
  }

  togglehideCategory(){
    this.hideCategory = !this.hideCategory
    let categoryBar = document.getElementById('collapsable-category-bar') as HTMLElement;
    categoryBar.style.zIndex = this.hideCategory ? '5': '0'
  }

  showOnlyFirstCategory() {
    setTimeout(() => {
      let allCategoryBlock = Array.from(
        document.getElementsByClassName(
          'category-wrapper'
        ) as HTMLCollectionOf<HTMLElement>
      );
      allCategoryBlock.forEach((ele, index) => {
        if (index == 0) {
          this.currentCategory = ele.id
          ele.classList.add('show');
          ele.classList.remove('hidden');
        } else {
          ele.classList.remove('show');
          ele.classList.add('hidden');
        }
      });

      let allCategoryBar = Array.from(
        document.getElementsByClassName(
          'category-bar-items'
        ) as HTMLCollectionOf<HTMLElement>
      );
      allCategoryBar.forEach((ele, index) => {
        if (index == 0) {
          ele.classList.add('active');
        } else {
          ele.classList.remove('active');
        }
      });
    }, 10);
  }

  addItem(item,event) {
    event.stopPropagation()
    if (item.quantity < 10) {
      item.quantity += 1;
      this.amount += item.price;
    }
  }
  subItem(item, event) {
    event.stopPropagation()
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
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            parcelQuantity: item.parcelQuantity
          };
          this.orderList.itemList.push(itemSummary);
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
        if(result.mode == 'wallet'){
          this._router.navigate(['/user/myorders'])
        }
        this.orderList = { itemList: [], amount: 0, restaurant_id: null };
      } else {
        this.orderList = { itemList: [], amount: 0, restaurant_id: null };
      }
    });
  }

  categoryClickEventHandler(category) {
    this.currentCategory = category
    category = category.replace(' ', '');
    let allCategoryBlock = Array.from(
      document.getElementsByClassName(
        'category-wrapper'
      ) as HTMLCollectionOf<HTMLElement>
    );
    allCategoryBlock.forEach((element) => {
      element.classList.remove('show');
      element.classList.add('hidden');
    });
    let categoryBlock = document.getElementById(category);
    categoryBlock.classList.add('show');
    categoryBlock.classList.remove('hidden');

    let allCategoryBar = Array.from(
      document.getElementsByClassName(
        'category-bar-items'
      ) as HTMLCollectionOf<HTMLElement>
    );
    allCategoryBar.forEach((ele) => {
      if (ele.classList.contains(category)) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    });
  }
}
