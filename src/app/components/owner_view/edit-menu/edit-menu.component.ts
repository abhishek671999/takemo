import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { EditFormDialogComponent } from '../edit-form-dialog/edit-form-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { SuccessfulDialogComponent } from '../successful-dialog/successful-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';
import { DeleteCategoryConfirmationDialogComponent } from '../delete-category-confirmation-dialog/delete-category-confirmation-dialog.component';
import {
  svgAvilableIcon,
  svgDeleteIcon,
  svgEditIcon,
  svgNotAvailableIcon,
  svgPlusIcon,
} from 'src/app/shared/icons/svg-icons';
import { RestuarantService } from 'src/app/shared/services/restuarant/restuarant.service';

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
    private _restaurantService: RestuarantService
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
        let dialogRef = this._dialog.open(ErrorDialogComponent);
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
      data: Object.assign(category, { restaurant_id: this.restaurantId }),
    });
    this._handleDialogComponentAfterClose(dialogRef);
  }

  toggleRestoOpen() {
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
        alert('Some thing went wrong');
        console.log('Error while toggling: ', error);
      }
    );
  }
}
