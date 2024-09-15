import { ImageService } from './image-services';
import {Component, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BillingService } from 'src/app/shared/services/billing/billing.service';

import moment from 'moment';
import { sessionWrapper } from 'src/app/shared/site-variable';
// const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BillingComponent {
  restaurantList = [
    // { displayValue: 'All', restaurant_id: 0},
    { displayValue: 'Amulya Kitchen', restaurant_id: 1 },
    { displayValue: 'Honey Dew Kitchen', restaurant_id: 2 },
  ];
  selectedRestaurant: number = this.restaurantList[0].restaurant_id;
  restaurantFlag = this.__sessionWrapper.getItem('restaurant_id')
    ? true
    : false;

  constructor(
    private _billingService: BillingService,
    private __sessionWrapper: sessionWrapper
  ) {}
  base64: string;

  ngOnInit() {
    var date = new Date();
    let body = {
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id')
        ? this.__sessionWrapper.getItem('restaurant_id')
        : this.selectedRestaurant,
      month_and_year: `${date.toLocaleString('default', {
        month: '2-digit',
      })}/${date.getFullYear()}`,
    };
    this._billingService.getRestaurantBilling(body).subscribe(
      (data) => {
        this.base64 = data['base64_invocie_data'];
        this.printPdf();
      },
      (error) => {
        console.log('Error while getting pdf data: ', error);
      }
    );
  }

  onDateChange(value) {
    console.log(value);
    let body = {
      restaurant_id: this.selectedRestaurant,
      rule_id: 1,
      month_and_year: value,
    };
    console.log(body);
    this._billingService.getRestaurantBilling(body).subscribe(
      (data) => {
        this.base64 = data['base64_invocie_data'];
        this.printPdf();
      },
      (error) => {
        console.log('Error while getting pdf data: ', error);
      }
    );
  }
  data: string;
  pdfSrc = '';
  printPdf() {
    //let json: any =  { "type":"Buffer", "data":this.blob }
    //let bufferOriginal = Buffer.from(json.data);
    const byteArray = new Uint8Array(
      atob(this.base64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    const file = new Blob([byteArray], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    this.pdfSrc = fileURL;
    //window.open(fileURL);
  }

  downloadPdf() {
    const byteArray = new Uint8Array(
      atob(this.base64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    const file = new Blob([byteArray], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    let pdfName = 'reports.pdf';
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(file, pdfName);
    } else {
      //window.open(fileURL);

      // Construct the 'a' element
      let link = document.createElement('a');
      link.download = pdfName;
      link.target = '_blank';

      // Construct the URI
      link.href = fileURL;
      document.body.appendChild(link);
      link.click();

      // Cleanup the DOM
      document.body.removeChild(link);
    }
  }

  date = new FormControl(moment());

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
}
