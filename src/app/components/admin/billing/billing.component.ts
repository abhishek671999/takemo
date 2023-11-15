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
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class BillingComponent {


  constructor(private _billingService: BillingService){}
  base64: string

  ngOnInit(){
    let body = {
        "restaurant_id": 1,
        "rule_id": 1,
        "month_and_year": "11/2023"
    }
    this._billingService.getRestaurantBilling(body).subscribe(
      data => {
        this.base64 = data['base64_invocie_data']
        this.printPdf()
      },
      error => {
        console.log('Error while getting pdf data: ', error)
      }
    )
  }


  onDateChange(value){
    console.log(value)
    let body = {
      "restaurant_id": 1,
      "rule_id": 1,
      "month_and_year":value
  }
  console.log(body)
  this._billingService.getRestaurantBilling(body).subscribe(
    data => {
      this.base64 = data['base64_invocie_data']
      this.printPdf()
    },
    error => {
      console.log('Error while getting pdf data: ', error)
    }
  )
  }
  data: string;
  pdfSrc = "";
  printPdf() {
    //let json: any =  { "type":"Buffer", "data":this.blob }
    //let bufferOriginal = Buffer.from(json.data);
    const byteArray = new Uint8Array(
      atob(this.base64)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    const file = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    this.pdfSrc = fileURL;
    //window.open(fileURL);
  }

  downloadPdf() {
    const byteArray = new Uint8Array(
      atob(this.base64)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    const file = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    let pdfName = "reports.pdf";
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(file, pdfName);
    } else {
      //window.open(fileURL);

      // Construct the 'a' element
      let link = document.createElement("a");
      link.download = pdfName;
      link.target = "_blank";

      // Construct the URI
      link.href = fileURL;
      document.body.appendChild(link);
      link.click();

      // Cleanup the DOM
      document.body.removeChild(link);
    }
  }

  date = new FormControl(moment());

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  

  // base64 = `JVBERi0xLjcKJeLjz9MKMiAwIG9iago8PC9DcmVhdGlvbkRhdGUgKEQ6MjAyMzExMTMxMTI3MTFa
  // MDApIC9Nb2REYXRlIChEOjIwMjMxMTEzMTEyNzExWjAwKSAvUHJvZHVjZXIgKGJvcmIgMi4xLjE4
  // KT4+CmVuZG9iagoKMSAwIG9iago8PC9QYWdlcyAzIDAgUiAvVHlwZSAvQ2F0YWxvZz4+CmVuZG9i
  // agoKMyAwIG9iago8PC9Db3VudCAxIC9LaWRzIFs0IDAgUl0gL1R5cGUgL1BhZ2VzPj4KZW5kb2Jq
  // Cgo0IDAgb2JqCjw8L0NvbnRlbnRzIDUgMCBSIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdIC9QYXJl
  // bnQgMyAwIFIgL1Jlc291cmNlcyA2IDAgUiAvVHlwZSAvUGFnZT4+CmVuZG9iagoKJSBib3JiIDIu
  // MS4xOAolIEpvcmlzIFNjaGVsbGVrZW5zCgo1IDAgb2JqCjw8L0ZpbHRlciAvRmxhdGVEZWNvZGUg
  // L0xlbmd0aCAxMDY0Pj4Kc3RyZWFtCnjaxZpdb9owFIbv+RWWdrNJleuvOM5lW5iE1FHappq2aRcU
  // 0o0JkxbCtP77GWipQ4x3yPLR3hh0ypvzPsfnNA7oCVGmMNn8oPWv9VIKHLysWITVdjnW6LSvKeqm
  // 6Bo9dc7jDtn9eWGx+NE5/UgRfX0dP3Qoy6vtxOhOjCjMlNjE6877b7fZIkkydDaZLJLl8vsHFP/q
  // 9OIOUJ2B1LlQWLGIc74v3x1lyZGSsIR5aCQ5d0hSfkrpKSOM1yL85nSgDFbL6Ytp9nyCbjOT8gn6
  // 2h+ii3SS1GQ441iEm+z3rqI//51Oxwl6V7fre7pBSETdfocUC8vv4c90Xpu/zBR0sMkzr9pdJaiJ
  // ot6Tba6oA46JZXJPj6azst3jaHEusLR3VKofR/Nn9Dm5X04zi3UH7f08GWUqIsLWl0AjSUJlFmy9
  // UuZaLA0Rha/CuvAxlEhMldqLm3njFMPyUJwlCwzzqT4U3nEYseayc724KMVFqNAuxvP+5SWKr2ou
  // BiGjXCXeJOPp4zSZZ2gw0kndpSgC4izFRrQ5q3CEH61OefVj7diL4FHg6/XO/U8IjxgzC0FpKIP1
  // /t++Y/Z/EO0+WfHXjejY/6YBF+Nm3jgZGJ0DcZYsMMyn2tr+5yGzt2K3d3tx0x/G/atBeSJuq4tI
  // mOmIEHPsOJ/XUHTQUmgYClXkAJXr+Et5Gm6XizQElSBX7Dify1Bq0CpomAaLogM07gb9GA1v+he9
  // 8lDcZhehBDwAmWPH+cyGwoMWQ8NQBFUHoJx9urobxD4g3itwt3NdSYsR8vWIwDsegGE+VTCNyme6
  // ubWw/qUaLtLJapwhWp6H22hdSZfxOQ0FBy2EhpHYMyTPhJVn4fZYV9JcfB5DmUFroGEW9gTJs7hZ
  // YhSQ8kDcRuvSU8GO8xkNBQcthIaB2NOjCIQS4p/n4fb4prjIj483Y3Ql3YUpLABzARjmU21vfJj6
  // Y8XxwcrzcButK2kxPqeh4KCF0OL4yDMR5Vm4PdaVdBefx1Bm0BpocXzkWay7lfyPZuU2WpceC3ac
  // z2goOGghtDg+ikCYIJXcfbwZoyvpLpQcPnW2ZIFhPtX2xoepF+tY83J0ny6qufPwwSjTXnwuQ6FB
  // i6DF0ZHnQUU1tx4+GGVai89kKDRoEbQ4O/Iw/j074LcePiDQmWDH+YyGgoMWQouzowhECVLJ8483
  // Y3QV7YVF1HPiGB0Z5lVt7fkHi5T9NCpOs9GslgdgVn/c06SkFkGrB+wJ1iJnVXghP1LzI0VmvCWl
  // 8wN+b0TuGgszytbhwe3qPqutbIQMsJAu2c2Zxcm6rI72F5hxILGI2EZa8NxXv6bLcbqaZ8t6Ug7X
  // KSuH7iblMKwtYeOlUFuvmbCbdDz6k9SfbF7z5UwK87qSDbDiW7pENtMDTaI4jKRDc5MsldzO9i8S
  // jJzBCmVuZHN0cmVhbQplbmRvYmoKCjYgMCBvYmoKPDwvRm9udCA3IDAgUiAvWE9iamVjdCA4IDAg
  // Uj4+CmVuZG9iagoKNyAwIG9iago8PC9GMSA5IDAgUiAvRjIgMTAgMCBSPj4KZW5kb2JqCgo5IDAg
  // b2JqCjw8L0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL1N1
  // YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Pj4KZW5kb2JqCgoxMCAwIG9iago8PC9CYXNlRm9udCAv
  // SGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL1N1YnR5cGUgL1R5cGUx
  // IC9UeXBlIC9Gb250Pj4KZW5kb2JqCgo4IDAgb2JqCjw8L0ltMSAxMSAwIFI+PgplbmRvYmoKCjEy
  // IDAgb2JqCjw8L0JpdHNQZXJDb21wb25lbnQgOCAvQ29sb3JTcGFjZSAvRGV2aWNlR3JheSAvRmls
  // dGVyIC9GbGF0ZURlY29kZSAvSGVpZ2h0IDIwMCAvTGVuZ3RoIDIyNTMgL1N1YnR5cGUgL0ltYWdl
  // IC9UeXBlIC9YT2JqZWN0IC9XaWR0aCAyMDA+PgpzdHJlYW0KeJztnHlclVUax5/LBRWUFBXFDVxw
  // Gz7aZB+dxmVcKtPRyVImdyXRz6iNiaWpJVOmuY1ak1qOY6jV4FKOOvIHYwGKU6O5QIgINmPYhCup
  // JCBwl9+cc973Xq4Dst2bL9Tz/YPznPNuz/fe9z3nPa/vlYhhGIZhGIZhGIZhGIZhGIZhGIZhGIZh
  // GIZhGIZhGKbOMeP3RmfgEabb7M8ZnYMHiLSdSbHPMjoLt5lmO9OiWYp9ptF5uInUIBIivzM6E7eI
  // sKW3kKUQmWF0Lm7g0JAitunG5uIGU50aSiTSyFzcYIpVapjmEy0gJTLN6IxqxGTr2ZZCY9PXRHiJ
  // lEiE0TnVgEmaxruQHlhISmSq0VlVm4lKw+vP0DywiKSIdYrReVWTCdazQUJjCxweWExKZLLRmVUL
  // XWMrSj0cIhONzq0ajLcojRi4euBlUiITjM6uyoyzZEiNbbjbA6+QEhlvdH5VpfjfQsO8Hf/vgSVi
  // YbN0i9H5VRXrh0LjfZT1QLRYutludH5VRXq8ifI85IBYtzziy/dIYI/7D3vULn5MHjuvODhB5Iyv
  // fFzXPO5N3fKo7+fAl8gZ+9Wvax6l10e26/Wxlz3uP+xRu2CP2gV71C7Yo3bBHrUL9qhd/Jg8ovc6
  // 2EzkjPfWuedX94Y97jfWq8kVcKnueKBC6ozHth0Vst3o/BiGYRjmp0qj4QtWr3q+r5moS3Ojc6k5
  // 7d8rhPVCZh5yFjeK+43R2dSYqfn4NvIBIlPvPbhUONbodGrKHDtOOE6mSBueNTSZmjPQitxWztoy
  // 1NG31c0ZwLzSqu/VBcbl4g7hQFFjl/rS2Y7IHBzayGWBTwOtzU9fGtKxvstSE1HTzk1dGsxtuoTU
  // K636yz9BnV2P5FkOqH+9L0ufPbcB26lZKhfvYcuSCsIpeOstwBLXlajrB98L/72d5ML2Y96Iv9a9
  // 5xE7kPWi7jbkUOF3F20lnzwkK6GzYr85SH7RF8Vk8dhQ0fCn/yoiRPi5DL5xX8MrD1hdTvMae9Hy
  // Xl3GpyMtVFQDT4u0F4y4sWvqbzeKyyk4oiB28titdlwJFAsz74jZ7JxrS3p2n3sDKa3l5uKa+8hM
  // Hc/ihuxA5p8A0jplHp0xYv51WAcTPTAmH/iyi49Y5j8K2N/afY8QkUM5P994C5ZHZdnwM1xqJ4PW
  // JUi9+ZiMlgKn8+WnSmu0lxLJNwko7iejsDykytNvJSC/ieGA9ouKHcj/epk49WgAcEA2zAcOaUfy
  // xVVPnGx9hEfZNwoHARu1qJMF8SrIBOaqoI3YQruGgvWk6AVgu7b6Au01xb5nNstaM2Cdap4DJJlU
  // dA7qJPK7hkLt4huOFz2gQf1FVs+Uaf0H8HM9jAN+IcvjKNKv8KvI16+C6zimymcB/Q3kphZcNjt3
  // 4wdsUEEEME5r2oVCVb4KRKjg41v+nvB4UHiUGfl8S/C9SY9fApbL8qh8s0eRhnN6lI5UVU4AntCb
  // Uks/Aeq+xeEhVuijtb0NqyqbF2ifQVDJOk9oUAC09zzvohuQ6YjHA7tkeRjn9ZYvkKZHJ3WPccBj
  // epPo/karwDQs/tp6h4fYyYPa8j/qHrQBeFgUiy0hHvGgLGCPaz1ghrhcgQxH/Rngo7s9jjs9TpT1
  // 2K2fQSO//C7Kz8/Fo6e2fI3Do4MFW0W/eGGnZzRkp5Pr41KfLo7T2I7rjvoc/VqtxGOo3hQPDCFq
  // 8CH+GSR6uwo8aCcKAmgYenvIo0PJXR2W6bQ8zimgnd7wPjCiCh7helM2SpoQbcNFcf9MnSvy6AVE
  // 0b4jHtJQfX12E2dtpjrONDHqaXX/mzinOqAj+Epf5QuccXqkOTxWaC091VkYaMNaWZsLvOPwcF4f
  // zue/nyKzreVJj3n4HAKOBOiVp4uUh/koctuoho2wDFTBSeTo66TjP3qUgQsOj5sdZWA6iMJuRD0g
  // z30KzL6J/WqFSOCX2iabAL37pqHiuFleHvMg3x1ATlQHE/kOjLWnbFLfe2AKzv+KqMW7KNZOupb5
  // sKlUqVURLMEqalcMa4juceeiGP+bbEXJGLnHPBTPDh2ZsSgRt9p07CTPM30QNZ9U14/ClOIY7j3F
  // 4wk2cdeXZ0fmbJ9u2vnru/I2crOtSFCjgW+SuEFEXlJ9qqdFhxtSwwQZ3UqqpzymJOLbM3dw4hG1
  // 9bgisSh/nvwecDlsZpoorJ8/TvTGVyIqSNDvpybguq9HPcTH/dQLry6a1F2G/fQm/ycXRkd21mLz
  // AA0v8tIjb/J2tmn9bu+5f5j9kGN/bWcsnNhMlCOXTPKnUG1F0YH11CI9+wZFSz2s4SYu40d1mHKn
  // pcdTcYuaeXhn/cXzqbjFZH2MqRZe6+w/+wFycYdooJr/KYDf5HfO4+APk02lDAgPD5Nl8/Dw8NGl
  // zY0H54ih9IlA8722K4cPZH/W3cP5VZW+cbginxAFTCs8Oqq0OTVHY+g9NyzLWuBcf0/nV2XE5DFR
  // feqJoypbtTJCgt1Pp8Z0TTsN1eXvH2xgFu7T9XinW1b5/GH/IDE7X/ne7rVtxaRr1ioauv3Aa/5e
  // 42P3zVOPiR5++2CMcWdN5XQ9TqPtV4I0j6xU78YZYm46NiV/1Ss9xhXHxz4XNhfrxWpROf2bRCnf
  // WorwoDeRYFYey8X90jqbmMY/rybG+yB/I3wqS9x8WEUnbLr9N4OTrQDpUe9feE15CEITYJaTFXkv
  // uRryMVTsVTlV+uzQocTjtW2wdkF6UHCu9VHl8chfV2yXHhGQA8FSyLu/GDEf3otadttUBuVBv7Zd
  // PjZIzOzSg8WXUI5HDHoYmmXlhJ1WxQpgEPXF00RJqCefwsn7pNfVPC8mV941yt/Zkk8FOzKYCO3Z
  // n/dh4TEEbwVExaNXU3oZcjTZgg7ib3xJQzJ/WvCUqf6ieRXvy0DWHU7+u3pM0+p8P/Jan31qYlBq
  // 2qg5Cclxgyn6cPK+XrQhOXl3e2oQnXbuk7rze3qGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiG
  // YX6a/A+onarQCmVuZHN0cmVhbQplbmRvYmoKCjExIDAgb2JqCjw8L0JpdHNQZXJDb21wb25lbnQg
  // OCAvQ29sb3JTcGFjZSAvRGV2aWNlUkdCIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9IZWlnaHQgMjAw
  // IC9MZW5ndGggMjkzOCAvU01hc2sgMTIgMCBSIC9TdWJ0eXBlIC9JbWFnZSAvVHlwZSAvWE9iamVj
  // dCAvV2lkdGggMjAwPj4Kc3RyZWFtCnic7Z3fbtvIFYd1202koZwNtgukdixSTmBgs93YkpxFAN32
  // BfQ8vqqlbNGLXBZtrGzv1kCLjR0E6NOl859Dcig5tmlF0veBMCJySA7JH885c2aGabUAAAAAAAAA
  // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIszm
  // V2fnV6uuBWwU0/NLqSv5d/ructV1gQ1hNv8oRTWbXypdyeU9Vgtuy/T8yojqb//+z9mv/zXSOptj
  // teDmTM9/96Iya7y0ZudIC27CVLk/KaErLypDLq05DhG+jOm/PjhR/a+61UjLRPL3XzdYU87OP8zO
  // a0VlyzhpzeYf7rNusKbI5t7s/Kogqs+fZ+cfzT/fBBF7YLV+v/96whohZaNENb/86z+tFfosRTVX
  // SjM/tYHKwyonrUsZjK2gurAOTN99nFZEZfMMRV1JR+n3stJSC2E8lHmj3JlKKXhRnZ6entkIqqwr
  // k3zw+zppXZEyhRCdN1Bq+WV+YdZIUU29qOK6KnQXemmRMgXDclHV6Eot78vSkod6Q15r6zl7p/JU
  // FVFdlfVTpyvtPfOjOWmR19pmbG/y/PIX15o7Pf08q4pqoa70kjcGvbTO3pPX2lJ0nioX1eTi4o0d
  // uvCluioYKC0tTNb2okzTe/v0Ly4uIu7v2roq5bWm8w/oamsJdVUO1G+kKy8tdLXNFHT17k505Y6G
  // rrYYdAVNgK6gCdAVNAG6gia4fntwek1duXEO6GqbCXV1t6CrbSbU1dtPn07/cVm3/P2330yxBWXk
  // 8vbtJ1MMXW0zXxBfucBpsR+ckhcFdAXNgK6gCdAVNAG6giZAV9AE6AqaAF1BE6AraAJ0BU2ArqAJ
  // 0BU0AbqCJkBX0AToCpog1JVRRd3yJhfMomKzd+gKGC8KjYCuoAn0p0TVhx/vfDH/6cmqrw9WQ/yT
  // RHe0oKutZWa/N9vIwv/8BQAAAAAAAAAAAAD3wOPDcbc3Ev1hkg5EOkz6g2563GpNzNb2/uDhwdFq
  // awjrhdgbKS1lgyQbJvJvKpehSNVPof8tJad/Hq+6prA2JD1tnbSERDbcyYZ+U+fgWCtNbhpK1XVS
  // dAXXIkmNjVJLnZsTroDAXsE1kH4tMb4vHX6z+3JBSWPQZLF7qxusLRPhjJXIlgjmyZMTqUDRQ1ew
  // BO/dpCvs9pY39JbF7RN5kE56IiP85ec+OtrbC4vZfb//PlqNSfL0legft7K/LD+yo3N40u6N5N9r
  // lJ3s9E9ka1eepXV4uLjoo2c/hz+/2RvIs1zn7m0PrvWnGoC3OU6nf2SbjV6o5pilZzQed3W7QNk9
  // ZyHlE0nsSqtweZz2M6ve9tNjode4rWrpZAV/LZ6NRDYSzpvv9EfJ/sh6bR8WpoNWlkXuQG/oWsGu
  // DqlZU3h9pOBVAV1PoSMBqf98F1fzTmDzhW5Nl5defp9FViywzF+sEcHzurmuXHhm7rl667v9oXC+
  // VT4RX/KP2Wufu1Bb5TPdH9rde0ZpAx/sSb2JvjmmynLIdmjQvhg8zF7nV5G5g7hrUdroDaS6lMaC
  // APLRs5+KNfebBiZHJ02iq14hUxeqVDWKs5eJbh2rwvJiVd1sxYSLP3dUyVze6mXZH0gr7Y8p7V6S
  // 5scsmcH1Rdr8gm25ES6YL7yJku++eyFcdqJbTE3Ih5u4nIb62z8uHjA3TUKZpsJbnOun2HwwsZ/f
  // VPJKXWfx5N/Q+QaPNa9DtzcyK7uVe2JMor7ksnnRL4hVSOT+1LV3VLXV0TbJjRrnZe9h/yZGWKSj
  // 6M20x89+9hamsqPXczlak3FOoPbyVuU0a1oZixsgyjZWLLMUvLGHYcn289z0lQ4SGszqKczW0tmV
  // u0ztLXpcidyMhsUtnMVXiH8xE+WtbnJp/j5LhxUt4J91uz+K7JgOo1F64sxCNCJK0rI87Lmy4wWW
  // QUbvgcgnCy5KB07xl0Vepr1dvUjjpW6v3IFW7pIJHjbGAxpkYBDEDF+c7VSux7mzujJBNnVYXD+I
  // aiPcS9QkytzW6uMbLH5HxLK3oKWs5Si4J/Wn6EdeB1FjymSc5loEhU2yIWluYF1l1hSx+0Pucepv
  // dR2PDmpdkqcbSLdw6jT+CAzOccQP66xZeV9vfksBW37SbLCgQNeZ0NwIV6qXX87TSN2c6iIXlZ86
  // ze22PdfTV9HarjVBJHOtt0ZK0T/Qrr//9faqU9PevJ2u4iddqqsgmCw65UznGbRLkk5wgR/MdbU/
  // alVwgozp6mCYVEy0Lr9RkZWn0Lw6umZe1OnKhdALenbCnsficRrUVadmx9wp+y6DvbFwQbX0Smad
  // bMneua5a3szKZfeHlnsrO/ub2dmq3qPUv8XLTZYuHLxxTpbdmkEOed61f3+6qtvRJ07F3o+lE4Xj
  // N9q92kbubXQl0pOwemGmayMRQWrO3/Ao3Ur8kFuAmCZV3i+PwAtNsDvQVfWh1+tB7XXgAnInyIfZ
  // n6O2NMlGQbWLp/C6il2vf8ui1fbXlWgZ6+RtRJybw9FRHqnKd3n3dbSU6A2SiBgmQe9JuRvON/qq
  // aag8kxA910L3apt19fYqGmJ5f+ez6Mn+y2rsJ8WWx9iRvKg9fjsWUvo3tKaLs9Xx1dvEZmCVJ09O
  // ggaL7jo5GPpNUhW5B6mEmuqtd3rzjcoHvVcuyxRxrw/2R6JeAN/uvnTZrUgWuhv0mJRaUqG9Upfg
  // 8v/SCPt0mchyE6Gu2rcBs5HvAey6viTlH/snsoa+OzLJ07lVUzPx9mrBkI886tjQiL1KR9n/Qi9b
  // obdX2pyjI51bKN8Q/YCGIn92A9/iLmWK7EiboBFqhJqZ/OfhYXWrPLIMpFs2nC5uNcbTJbFze5UO
  // fS4i7DpsV0yE2qXQ8Wedb6E3WUWPg06pi1n/7GRW9sEl5xX7w59+alXwPZXyVtz+ka0RD/RIACMS
  // /eaqrtuwQF1Plu5FHXXcwAAZ/cZKTVQytrL4zTVbTY/eePG+pTyDbGq5SOl4QdZ3R8vPVLv9vNgk
  // Udn1Y5MMV9ascmrfhJRhfKRiUeWoFuhgwzpuNpul+auvAWPPH8Sak/B1sga6Go8XNxjhKySPlG40
  // NqN5Tn2SYdU1gS+gbmjWajHjZETelPiK6rbBJH3bCusWQ1kzBsAu/SXRiBpZGg5DVZMczYDSReNh
  // 7ofCQFM9RnrVNdoK1Mg61/0RzjITu6/NsGQzCHnxQXSxYXUpDYNfCaGouvE2MjRCMGx1ULIwejr/
  // 2juO5OmrTRpmvC60nx2LdBgdIig2vXMWmkPqykzdsvO/DsJ+7YEfCGeCKN+V6VtVD3UXgJFfx4dk
  // qZ3eomYGpTZVW5p0Jo9sJm3pDiM81KZhdNXSc6xsoOXy2KGurDUbj7XA8pS1nv81tBZPSmj/xPTO
  // +AlieqTTqNS/bLaqLzLt/Wj13CMHvlF4XbUKQ5j0bL5AV7o/LtdYmF1UUwWzwlBq3w1XWmP/fTAq
  // RW6m7dDI5cGKCHUlXZWf6Ncq6spjBh4kwbQaO5Mi1JXp3+yFE0vzkRh+QpYeBDUwGkNXG0ZBV3Za
  // vXVMJV3tuG9wCWuvnK709KswNWTEGY4ZSIJ8hVERnXSbTUlXrbCnLw3jKyUnY4I66eD2upKRWKPX
  // BaulG8t8liZGqeF8wVA96wdd+87MSA373YQuH47bDHXldFu0V9eYNgJrhPm4R3nO79jNlNG6MrPg
  // lfnSeXgnuRPzDSKX+wqjdL3moLgmHX734oX+NXENRl0gy7qV7y3AWmP0YMaFPipOevr2+Uv9QQzr
  // rfzXhOTyeM9+2MdNI/Vf+zFTXfzQRLlG7S5cAXW6PW2m9sZm2qDJRWzqPD4AAAAAAAAAAAAAAAAA
  // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4P6wsWDUKZW5k
  // c3RyZWFtCmVuZG9iagoKeHJlZgowIDEzCjAwMDAwMDAwMDAgMDAwMDAgZg0KMDAwMDAwMDEyNiAw
  // MDAwMCBuDQowMDAwMDAwMDE1IDAwMDAwIG4NCjAwMDAwMDAxNzQgMDAwMDAgbg0KMDAwMDAwMDIz
  // MCAwMDAwMCBuDQowMDAwMDAwMzY4IDAwMDAwIG4NCjAwMDAwMDE1MDQgMDAwMDAgbg0KMDAwMDAw
  // MTU1MSAwMDAwMCBuDQowMDAwMDAxNzkwIDAwMDAwIG4NCjAwMDAwMDE1OTIgMDAwMDAgbg0KMDAw
  // MDAwMTY4OCAwMDAwMCBuDQowMDAwMDA0MjQ2IDAwMDAwIG4NCjAwMDAwMDE4MjIgMDAwMDAgbg0K
  // dHJhaWxlcgo8PC9JRCBbPDRiOTU3NWY3MWVjN2QxMTcwZmE2MmZlNzFhOTk5ZjMyPiA8NGI5NTc1
  // ZjcxZWM3ZDExNzBmYTYyZmU3MWE5OTlmMzI+XSAvSW5mbyAyIDAgUiAvUm9vdCAxIDAgUiAvU2l6
  // ZSAxMz4+CnN0YXJ0eHJlZgo3MzY4CiUlRU9G`
}
