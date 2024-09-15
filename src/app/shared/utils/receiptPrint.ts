import { Injectable } from "@angular/core";
import { confirmedOrder, lineItem } from "../datatypes/orders";
import { sessionWrapper } from "../site-variable";
import { dateUtils } from "./date_utils";


@Injectable({
    providedIn: 'root'
  })
export class ReceiptPrintFormatter{

    constructor(
        private sessionWrapper: sessionWrapper,
        private dateUtils: dateUtils
    ){

    }

    private confirmedOrder

    set confirmedOrderObj(confirmedOrder: confirmedOrder){
        this.confirmedOrder = confirmedOrder
    }

    getCustomerPrintableText() {
        let sectionHeader1 =
          '-'.repeat(16) + `${this.confirmedOrder.payment_mode.toUpperCase()}` + '-'.repeat(16);
        let tableHeader = '       DESCRIPTION         QTY  RATE   AMT';
        let endNote = 'Inclusive of GST (5%)\nThank you. Visit again';
        let sectionSeperatorCharacters = '-'.repeat(42);
        let content = [
          {
            text: this.sessionWrapper.getItem('restaurant_name'),
            justification: 'center',
            bold: true,
            size: 'xlarge',
          },
          {
            text: this.sessionWrapper.getItem('restaurant_address').replace(/-/gi, '\n'),
            justification: 'center',
            bold: true,
          },
          {
            text: this.dateUtils.getDateForRecipePrint(),
            justification: 'right',
          },
          {
            text: sectionHeader1,
            bold: true,
            justification: 'center',
          },
          {
            text: tableHeader,
            underline: true,
            justification: 'left',
          },
          {
            text: this.getFormattedDineInItemDetails(),
            justification: 'left',
          },
          {
            text: this.getFormattedParcelItemDetails(),
            justification: 'left',
          },
          {
            text: sectionSeperatorCharacters,
            justification: 'center',
          },
          {
            text: this.getGstDetails(),
            bold: true,
            justification: 'right',
          },
          {
            text: sectionSeperatorCharacters,
            justification: 'center',
          },
          {
            text: this.getTotalAmount(),
            bold: true,
            size: 'xlarge',
            justification: 'right',
          },
          {
            text: sectionSeperatorCharacters,
            justification: 'center',
          },
          {
            text: endNote,
            justification: 'center',
          },
          {
            text: this.sessionWrapper.getItem('restaurant_gst'),
            justification: 'center',
          },
        ];
        return content;
      }


    
  getFormattedDineInItemDetails() {
    let formattedTable = '';
    this.confirmedOrder.line_items.forEach((lineItem: lineItem, index) => {
      if (lineItem.item_quantity > 0) {
        let trimmedName = this.getFixedLengthString(
            lineItem.item_name.substring(0, 24),
          24,
          false,
          ' '
        );
        let remainingName =
          trimmedName.trim() == lineItem.item_name
            ? ''
            : ' ' +
              this.getFixedLengthString(
                lineItem.item_name.substring(24, 48),
                24,
                false,
                ' '
              ) +
              '\n';
        let itemQty = this.getFixedLengthString(lineItem.item_quantity, 3, true, ' ');
        let itemPrice = this.getFixedLengthString(lineItem.price, 4, true, ' ');
        let itemAmount = this.getFixedLengthString(
            lineItem.item_quantity * lineItem.price,
          4,
          true,
          ' '
        );
        formattedTable += `-${trimmedName}  ${itemQty}  ${itemPrice}  ${itemAmount}\n${remainingName}`;
      }
    });
    return formattedTable;
  }

  getFormattedParcelItemDetails() {
    let inititalString = '------------------Parcel------------------\n';
    let formattedTable = inititalString;
    let totalParcelItem = 0;
    this.confirmedOrder.line_items.forEach((element: any) => {
      if (element.parcelQuantity > 0) {
        let trimmedName = this.getFixedLengthString(
          element.name.substring(0, 24),
          24,
          false,
          ' '
        );
        let remainingName =
          trimmedName.trim() == element.name
            ? ''
            : ' ' +
              this.getFixedLengthString(
                element.name.substring(24, 48),
                24,
                false,
                ' '
              ) +
              '\n';
        let itemQty = this.getFixedLengthString(
          element.parcelQuantity,
          3,
          true,
          ' '
        );
        let itemPrice = this.getFixedLengthString(element.price, 4, true, ' ');
        let itemAmount = this.getFixedLengthString(
          element.parcelQuantity * element.price,
          4,
          true,
          ' '
        );
        totalParcelItem += element.parcelQuantity;

        formattedTable += `-${trimmedName}  ${itemQty}  ${itemPrice}  ${itemAmount}\n${remainingName}`;
      }
    });
    let parcelInfo = `${this.getFixedLengthString(
      'Parcel Charges Rs5/item',
      24,
      false,
      ' '
    )}   ${this.getFixedLengthString(
      totalParcelItem,
      3,
      true,
      ' '
    )}  ${this.getFixedLengthString(
      '5',
      4,
      true,
      ' '
    )}  ${this.getFixedLengthString(totalParcelItem * 5, 4, true, ' ')}`;
    return formattedTable == inititalString ? '' : formattedTable + parcelInfo;
  }

  getGstDetails() {
    let gstAmount = (this.confirmedOrder.total_amount * 0.05).toFixed(2); //check total amount /amount
    return `GST @ 5%: Rs.${gstAmount}`;
  }

  getTotalAmount() {
    return `Total Amount: Rs.${this.calculateTotalAmount()}`;
  }
  getFormattedCurrentDate() {
    return this.dateUtils.getDateForRecipePrint();
  }

  calculateTotalAmount() {
    let total = 0;
    this.confirmedOrder.line_items.forEach((lineItem: lineItem) => { // check itemlist vs item_list
      total += lineItem.price * (lineItem.item_quantity + (lineItem.parcel_quantity? lineItem.parcel_quantity: 0));
    });
    return total;
  }

  getFixedLengthString(string, length, prefix = true, fixValue = '0') {
    string = String(string);
    console.log('string length', string.toLocaleString().length);
    return string.length > length
      ? string.substring(0, length)
      : prefix
      ? fixValue.repeat(length - string.length) + string
      : string + fixValue.repeat(length - string.length);
  }
}