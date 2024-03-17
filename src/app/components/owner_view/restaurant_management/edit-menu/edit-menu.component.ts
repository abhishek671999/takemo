import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { EditFormDialogComponent } from '../../dialogbox/edit-form-dialog/edit-form-dialog.component';
import { DeleteConfirmationDialogComponent } from '../../dialogbox/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCategoryDialogComponent } from '../../dialogbox/add-category-dialog/add-category-dialog.component';
import { AddItemDialogComponent } from '../../dialogbox/add-item-dialog/add-item-dialog.component';
import { SuccessfulDialogComponent } from '../../dialogbox/successful-dialog/successful-dialog.component';
import { ErrorDialogComponent } from '../../dialogbox/error-dialog/error-dialog.component';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';
import { DeleteCategoryConfirmationDialogComponent } from '../../dialogbox/delete-category-confirmation-dialog/delete-category-confirmation-dialog.component';
import {
  svgAvilableIcon,
  svgDeleteIcon,
  svgEditIcon,
  svgNotAvailableIcon,
  svgPlusIcon,
} from 'src/app/shared/icons/svg-icons';
import { RestuarantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.css'],
})
export class EditMenuComponent {
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private _dialog: MatDialog,
    private _menuService: MenuService,
    private _menuEditService: EditMenuService,
    private _restaurantService: RestuarantService,
    private _counterService: CounterService,
    private _editMenuService: EditMenuService
  ) {
    iconRegistry.addSvgIconLiteral(
      'Available',
      sanitizer.bypassSecurityTrustHtml(svgAvilableIcon)
    );
    iconRegistry.addSvgIconLiteral(
      'Not Availabe',
      sanitizer.bypassSecurityTrustHtml(svgNotAvailableIcon)
    );
    iconRegistry.addSvgIconLiteral(
      'edit',
      sanitizer.bypassSecurityTrustHtml(svgEditIcon)
    );
    iconRegistry.addSvgIconLiteral(
      'delete',
      sanitizer.bypassSecurityTrustHtml(svgDeleteIcon)
    );
    iconRegistry.addSvgIconLiteral(
      'plus',
      sanitizer.bypassSecurityTrustHtml(svgPlusIcon)
    );
  }

  menu_response: any;
  fontStyle?: string;
  restaurantId: number;
  restaurantStatus = false;
  RestaurantAction = this.restaurantStatus
    ? 'Close restaurant'
    : 'Open restaurant';

  countersAvailable;

  public restaurantType = sessionStorage.getItem('restaurantType');

  ngOnInit() {
    this._route.paramMap.subscribe((params: ParamMap) => {
      this.restaurantId = parseInt(params.get('id'));
      setTimeout(() => {
        this._menuService.getMenu(this.restaurantId).subscribe(
          (data) => {
            (this.menu_response = data), console.log(this.menu_response);
          },
          (error) => console.log(error)
        );
      }, 1000);
    });
    this._menuService.getMenu(this.restaurantId).subscribe(
      (data) => (this.restaurantStatus = data['is_open']),
      (error) => console.log(error)
    );
    this._counterService
      .getRestaurantCounter(this.restaurantId)
      .subscribe((data) => {
        this.countersAvailable = data['counters'];
      });
  }

  toggleAvailability(item) {
    console.log('Toggled', item);
    let body = {
      item_id: item.id,
      is_available: !item.is_available,
    };
    this._menuEditService.editItemAvailability(body).subscribe(
      (data) => {
        console.log('Toggle successfule: ', data);
        item.is_available = !item.is_available;
      },
      (error) => console.log('Toggle failed: ', error)
    );
  }

  updateCounter(item) {
    console.log(item);
    let body = {
      item_id: item.id,
      name: item.name,
      price: item.price,
      veg: item.veg,
      non_veg: item.non_veg,
      egg: item.egg,
      counter_id: item.counter.counter_id,
    };
    this._menuEditService.editMenu(body).subscribe(
      (data) => console.log(data),
      (error) => {
        alert("Couldn't update counter");
        this.ngOnInit();
      }
    );
  }

  toggleFavorite(item) {
    console.log('Toggled', item);
    let body = {
      item_id: item.id,
      is_favourite: !item.is_favourite,
    };
    this._menuEditService.editItemAvailability(body).subscribe(
      (data) => {
        console.log('Toggle successfule: ', data);
        item.is_favourite = !item.is_favourite;
      },
      (error) => console.log('Toggle failed: ', error)
    );
  }

  _handleDialogComponentAfterClose(dialogRef) {
    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) {
        console.log('Nothing');
      } else if (result.success == 'ok') {
        let dialogRef = this._dialog.open(SuccessfulDialogComponent);
        setTimeout(() => {
          dialogRef.close();
        }, 2000);
        this.ngOnInit();
      } else if (result.success == 'failed') {
        console.log(result);
        let dialogRef = this._dialog.open(ErrorMsgDialogComponent, {
          data: { msg: result.errorMsg },
        });
        setTimeout(() => {
          dialogRef.close();
        }, 2000);
        this.ngOnInit();
      } else {
        console.log('Nothing else');
      }
    });
  }

  editItem(item) {
    console.log('Edit item: ', item);
    let dialogRef = this._dialog.open(EditFormDialogComponent, {
      data: Object.assign(item, { restaurant_id: this.restaurantId }),
    });
    this._handleDialogComponentAfterClose(dialogRef);
  }

  deleteItem(item) {
    console.log('Delete item: ', item);
    let dialogRef = this._dialog.open(DeleteConfirmationDialogComponent, {
      data: Object.assign(item, { restaurant_id: this.restaurantId }),
    });
    this._handleDialogComponentAfterClose(dialogRef);
  }

  deleteCategory(category) {
    console.log('Deleting category', category);
    let dialogRef = this._dialog.open(
      DeleteCategoryConfirmationDialogComponent,
      {
        data: category,
      }
    );
    this._handleDialogComponentAfterClose(dialogRef);
  }

  addCategory() {
    console.log('Add category');
    let dialogRef = this._dialog.open(AddCategoryDialogComponent, {
      data: { restaurant_id: this.restaurantId },
    });
    this._handleDialogComponentAfterClose(dialogRef);
  }

  addItem(category) {
    console.log('Add item', category);
    let dialogRef = this._dialog.open(AddItemDialogComponent, {
      data: Object.assign(category, {
        restaurant_id: this.restaurantId,
        counters: this.countersAvailable,
      }),
    });
    this._handleDialogComponentAfterClose(dialogRef);
  }

  toggleRestOpen() {
    console.log('Restaurant toggled');
    let body = {
      restaurant_id: sessionStorage.getItem('restaurant_id'),
      is_open: !this.restaurantStatus,
    };
    this._restaurantService.editIsRestaurantOpen(body).subscribe(
      (data) => {
        this.RestaurantAction = this.restaurantStatus
          ? 'Close restaurant'
          : 'Open restaurant';
        this.restaurantStatus = !this.restaurantStatus;
        console.log(data);
      },
      (error) => {
        alert('Something went wrong');
        console.log('Error while toggling: ', error);
      }
    );
  }

  toggleCategoryAvailability(category) {
    console.log('Category toggled', category, category);
    let body = {
      category_id: category.category.id,
      hide_category: !category.category.hide_category,
    };
    console.log('This is body', body);
    this._menuEditService.editCategoryAvailability(body).subscribe(
      (data) => {
        category.hide_category != category.hide_category;
      },
      (error) => {
        alert('Failed to toggle category');
      }
    );
  }

  navigateToPOS() {
    this._router.navigate(['/owner/point-of-sale']);
  }
  navigateToOrders() {
    let navigationURL =
      sessionStorage.getItem('restaurant_kds') == 'true'
        ? '/owner/orders/pending-orders'
        : sessionStorage.getItem('restaurantType') == 'e-commerce'
        ? '/owner/orders/unconfirmed-orders'
        : '/owner/orders/orders-history';
    this._router.navigate([navigationURL]);
  }

  isRestaurantType(val: string) {
    return this.restaurantType == val;
  }

  editInventory(item, event) {
    let body = {
      item_id: item.id,
      name: item.name,
      price: item.price,
      inventory_stock: event.target.value,
      veg: item.veg,
      non_veg: item.non_veg,
      egg: item.egg,
    };
    this._editMenuService.editMenu(body).subscribe(
      (data) => {
        console.log('Successfully updated');
        item.inventory_stock = event.target.value;
      },
      (error) => {
        console.log('Error while updating', error);
      }
    );
  }
}
