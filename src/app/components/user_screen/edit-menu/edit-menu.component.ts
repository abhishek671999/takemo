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
import { svgAvilableIcon, svgDeleteIcon, svgEditIcon, svgNotAvailableIcon, svgPlusIcon } from 'src/app/shared/icons/svg-icons';


@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.css'],
})

export class EditMenuComponent {
  constructor(
    private _menuService: MenuService,
    private _route: ActivatedRoute,
    private _menuEditService: EditMenuService,
    private _router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private _dialog: MatDialog
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
  }

  toggleAvailability(item, availablity) {
    console.log('Toggled', item);
    let body = {
      item_id: item.id,
      is_available: availablity,
    };
    this._menuEditService.editItemAvailability(body).subscribe(
      (data) => console.log('Toggle successfule: ', data),
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
}
