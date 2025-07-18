import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { EditFormDialogComponent } from '../../dialogbox/edit-form-dialog/edit-form-dialog.component';
import { DeleteConfirmationDialogComponent } from '../../dialogbox/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCategoryDialogComponent } from '../../dialogbox/add-category-dialog/add-category-dialog.component';
import { AddItemDialogComponent } from '../../dialogbox/add-item-dialog/add-item-dialog.component';
import { SuccessfulDialogComponent } from '../../dialogbox/successful-dialog/successful-dialog.component';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';
import { DeleteCategoryConfirmationDialogComponent } from '../../dialogbox/delete-category-confirmation-dialog/delete-category-confirmation-dialog.component';
import {
  svgAvilableIcon,
  svgDeleteIcon,
  svgEditIcon,
  svgNotAvailableIcon,
  svgPlusIcon,
} from 'src/app/shared/icons/svg-icons';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { MatTableDataSource } from '@angular/material/table';
import { EditCategoryDialogComponent } from '../../dialogbox/edit-category-dialog/edit-category-dialog.component';
import { CacheService } from 'src/app/shared/services/cache/cache.service';

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
    private _restaurantService: RestaurantService,
    private _counterService: CounterService,
    private _editMenuService: EditMenuService,
    private __cd: ChangeDetectorRef,
    private meUtility: meAPIUtility,
    private cacheService: CacheService
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

  menu: any;
  fontStyle?: string;
  restaurantId: number;
  restaurantStatus = false;
  parcelEnabled = false;
  printerRequired = false
  RestaurantAction = this.restaurantStatus
    ? 'Close restaurant'
    : 'Open restaurant';

  countersAvailable;
  public restaurantKDSenabled;
  public restaurantType
  public counterMangement
  public inventoryManagement
  public mobileOrderingEnabled 
  public isPOSEnabled

  displayedColumns
  dataSource = new MatTableDataSource([])

  public selectedCategoryId = ''
  public searchText = '';
  public currentCategory;
  public visibleCategory
  
  selectedCategory = [{
    "categoryId": null,
    "categoryName": 'None'
  }]
  public allCategories = []
  public filteredMenu = []


  ngOnInit() {
    this.searchText = ''
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        console.log(restaurant)
        this.restaurantId = restaurant['restaurant_id']
        this.restaurantKDSenabled = restaurant['restaurant_kds'] 
        this.restaurantType = restaurant['type']
        this.counterMangement = restaurant['counter_management']
        this.inventoryManagement = restaurant['inventory_management']
        this.mobileOrderingEnabled = restaurant['mobile_ordering']
        this.isPOSEnabled = restaurant['pos']
        this.printerRequired = restaurant['printer_required']
        this.fetchAdminMenu()
        this.fetchCounters()
        this.displayedColumns = ['id', 'item', 'price', ...(this.mobileOrderingEnabled? ['available', 'item_parcel']: []), 'favorite', ...(this.inventoryManagement? ['inventory']: []) ,...(this.counterMangement? ['counter']: []), 'edit', 'delete'];
      }
    )

  }

  fetchAdminMenu(){
    this._menuService.getAdminMenu(this.restaurantId).subscribe(
      (data) => {
        this.restaurantStatus = data['is_open']
        this.parcelEnabled = data['restaurant_parcel']
        this.menu = data['menu']
        this.createAllCategory();
        this.allCategories = this.parseCategories()
        this.showCategory()
        this.filteredMenu = JSON.parse(JSON.stringify(this.menu));
      },
      (error) => console.log(error)
    );
  }

  fetchCounters(){
    this._counterService
      .getRestaurantCounter(this.restaurantId)
      .subscribe((data) => {
        this.countersAvailable = data['counters'];
      });
  }

  showCategory() {
    if (this.selectedCategory.length > 0 && this.selectedCategory[0].categoryId) {
      let lastViewCategory = localStorage.getItem('lastViewCategoryId')
      let categoryId = lastViewCategory? lastViewCategory: this.selectedCategory[0].categoryId
      this.visibleCategory = this.menu.filter(category => category.category.id == categoryId)
      this.dataSource.data = this.visibleCategory[0].category.items
      this.selectedCategory = this.allCategories.filter((ele) => ele.categoryId == categoryId)
    } else {

      this.selectedCategory = [this.allCategories[0]]
      this.visibleCategory = this.menu
      this.dataSource.data = this.visibleCategory[0].category.items
    }
  }

  createAllCategory() {
    let allItems = [];
    this.menu.forEach((ele, index) => {
      if(ele.category.name.toUpperCase() != "FAVOURITES"){
        ele.category.items.forEach(item => {
          allItems.push(item);
        });
      }
    });
    this.menu.push({
      category: {
        id: null,
        name: 'All',
        hide_category: false,
        items: allItems,
      },
    });
  }

  parseCategories() {
    let categories = []
    this.menu.forEach((category) => {
      categories.push({
        "categoryId": category.category.id,
        "categoryName": category.category.name
      }
      )
    })
    return categories
  }

  toggleAvailability(item) {
    let body = {
      item_id: item.id,
      is_available: !item.is_available,
    };
    this._menuEditService.editItemAvailability(body).subscribe(
      (data) => {
        item.is_available = !item.is_available;
      },
      (error) => {
        alert('Failed to change availability')
      }
    );
  }

  toggleItemParcel(item){
    let body = {
      item_id: item.id,
      parcel_available: !item.parcel_available
    }
    this._menuEditService.editItemAvailability(body).subscribe(
      (data) => {
        item.parcel_available = !item.parcel_available;
      },
      (error) => {
        this._dialog.open(ErrorMsgDialogComponent, { data: { msg: error.error.description} });
      }
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
      inventory_stock: item.inventory_stock
    };
    this._menuEditService.editMenu(body).subscribe(
      (data) => console.log(data),
      (error) => {
        this._dialog.open(ErrorMsgDialogComponent, { data: { msg: "Couldn't update counter" } });
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
        item.is_favourite = !item.is_favourite;
      },
      (error) => {
        alert('Toggle failed')
      }
    );
  }

  _handleDialogComponentAfterClose(dialogRef) {
    console.log('returned: ', dialogRef)
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
      data: Object.assign(item, { restaurant_id: this.restaurantId, countersAvailable: this.countersAvailable}),
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
    let dialogRef = this._dialog.open(AddCategoryDialogComponent, {
      data: { restaurant_id: this.restaurantId },
    });
    this._handleDialogComponentAfterClose(dialogRef);
  }

  addItem() {
    console.log('add item')
    let dialogRef = this._dialog.open(AddItemDialogComponent, {
      data: Object.assign(this.selectedCategory[0], {
        restaurant_id: this.restaurantId,
        counters: this.countersAvailable,
      }),
    });
    this._handleDialogComponentAfterClose(dialogRef);
  }

  toggleRestOpen() {
    let body = {
      restaurant_id: this.restaurantId,
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
        this._dialog.open(ErrorMsgDialogComponent, { data: { msg: 'Something went wrong' } });
        console.log('Error while toggling: ', error);
      }
    );
  }

  toggleParcelOn(){
    let body = {
      restaurant_id: this.restaurantId,
      is_open: this.restaurantStatus,
      accept_parcel: !this.parcelEnabled
    };
    this._restaurantService.editIsRestaurantOpen(body).subscribe(
      (data) => {
        this.parcelEnabled = !this.parcelEnabled;
      },
      (error) => {
        this._dialog.open(ErrorMsgDialogComponent, { data: { msg: error.error.description} });
      }
    );
  }

  togglePrinterRequired(){
    let body = {
      restaurant_id: this.restaurantId,
      is_open: this.restaurantStatus,
      accept_parcel: this.parcelEnabled,
      print_required: !this.printerRequired
    };
    this._restaurantService.editIsRestaurantOpen(body).subscribe(
      (data) => {
        this.printerRequired = !this.printerRequired;
        localStorage.setItem('has_expired', 'true')
        this.meUtility.hasExpired = true
      },
      (error) => {
        this._dialog.open(ErrorMsgDialogComponent, { data: { msg: error.error.description} });
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
    this.restaurantKDSenabled
        ? '/owner/orders/pending-orders'
        : this.restaurantType == 'e-commerce'
        ? '/owner/orders/unconfirmed-orders'
        : '/owner/orders/orders-history';
    this._router.navigate([navigationURL]);
  }

  isType(val: string) {
    return this.restaurantType == val;
  }

  editInventory(item, event) {
    let body = {
      item_id: item.id,
      name: item.name,
      price: item.price,
      inventory_stock: event.target.value == ''? null: event.target.value,
      veg: item.veg,
      non_veg: item.non_veg,
      egg: item.egg,
      counter_id: Number(item.counter.counter_id)
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

  getMenu() {
    return this.visibleCategory.length > 0? this.visibleCategory[0].category.items: []
  }

  filterItems() {
    if (this.searchText) {
        this.selectedCategory = this.allCategories.filter((ele, index) => index == this.allCategories.length - 1)
        this.visibleCategory = [JSON.parse(JSON.stringify(this.menu[this.menu.length - 1]))]
        this.visibleCategory[0].category.items = this.visibleCategory[0].category.items.filter((item) =>{
          let acronym = item.name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
          return (item.name.toLowerCase().includes(this.searchText.toLowerCase()) || (acronym.toLowerCase().includes(this.searchText.toLowerCase())) ) 
        }
        );
        this.dataSource.data = this.visibleCategory[0].category.items
    } else {
      this.selectedCategory = this.allCategories.filter((ele, index) => index == 0)
      this.visibleCategory = [JSON.parse(JSON.stringify(this.menu))[0]];
      this.dataSource.data = this.visibleCategory[0].category.items
    }
  }

  onCategorySelection(category) {
    this.selectedCategory = this.allCategories.filter(ele => ele == category)
    localStorage.setItem('lastViewCategoryId', this.selectedCategory[0].categoryId)
    this.showCategory()
  }


  editCategory(category){
    let matdialgRef = this._dialog.open(EditCategoryDialogComponent, {data: category})
    matdialgRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }

  disableAddButton() {
    let disableAddButton = this.selectedCategory.length > 0 && !this.selectedCategory[0].categoryId
    return disableAddButton
  }

  ngOnDestroy(){
    localStorage.removeItem('lastViewCategoryId')
    this.cacheService.clear('parsedMenu')
  }

}
