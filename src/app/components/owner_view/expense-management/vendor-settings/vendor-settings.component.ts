import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-vendor-settings',
  templateUrl: './vendor-settings.component.html',
  styleUrls: ['./vendor-settings.component.css'],
})
export class VendorSettingsComponent {
  constructor(
    private __vendorService: VendorService,
    private __fb: FormBuilder,
    private meUtility: meAPIUtility
  ) {}
  public vendorList = [];
  public restaurantId: number;

  vendorForm = this.__fb.group({
    name: ['', [Validators.required, Validators.maxLength(25)]],
    email: ['', [ Validators.email]],
    mobile: [
      '',
      [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
    ],
    description: ['', [Validators.maxLength(50)]],
  });

  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
      this.fetchVendors()
      }
    )
  }

  fetchVendors(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append('restaurant_id', this.restaurantId);
    this.__vendorService.getVendor(httpParams).subscribe(
      (data) => {
        this.vendorList = data['vendors'];
        this.vendorList.forEach((vendor) => {
          vendor['is_edit'] = false;
        });
      },
      (error) => {
        console.log('Failed to get Vendor list');
      }
    );
  }

  addVendor() {
    let body = {
      name: this.vendorForm.value.name,
      email: this.vendorForm.value.email,
      mobile: this.vendorForm.value.mobile,
      description: this.vendorForm.value.description,
      restaurant_id: this.restaurantId,
    };
    this.__vendorService.addVendor(body).subscribe(
      (data) => {
        console.log('Vendor added: ', data);
        this.vendorForm.reset();
        this.vendorForm.markAsPristine();
        this.vendorForm.markAsUntouched();
        this.ngOnInit();
      },
      (error) => {
        console.log('Error while adding vendor: ', error);
      }
    );
  }

  editVendor(vendor) {
    let body = {
      name: vendor.name,
      email: vendor.email,
      mobile: vendor.mobile,
      description: vendor.description,
      restaurant_id: this.restaurantId,
      vendor_id: vendor.id,
    };
    this.__vendorService.editVendor(body).subscribe(
      (data) => {
        console.log('Vendor added: ', data);
        vendor.is_edit = !vendor.is_edit;
      },
      (error) => {
        console.log('Error while adding vendor: ', error);

        this.ngOnInit();
      }
    );
  }

  deleteVendor(vendor) {
    let body = {
      vendor_id: vendor.id,
    };
    console.log('Deleting vendor: ', body);
    this.__vendorService.deleteVendor(body).subscribe(
      (data) => {
        console.log('Deleted vendor');
        this.ngOnInit();
      },
      (error) => console.log('Error while deleting vendor')
    );
  }
  enableEdit(vendor) {
    vendor.is_edit = !vendor.is_edit;
  }

  console1() {
    console.log(this.vendorForm.hasError, this.vendorForm.errors);
  }
}
