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

    getMobileOrderPrintableText(){
        let sectionSeperatorCharacters = '-'.repeat(42);
        let content = [
          {
            text: this.sessionWrapper.getItem('restaurant_name'),
            justification: 'center',
            bold: true,
            size: 'xlarge',
          },
          {
            text: this.confirmedOrder.ordered_time,
            justification: 'right',
          },
          {
            text: sectionSeperatorCharacters,
            bold: true,
            justification: 'center',
          },
          {
            text: this.getFormattedCounterItemDetails(this.confirmedOrder.order_list),
            justification: 'left',
            size: 'xlarge'
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
            text: `Order No: ${this.confirmedOrder.order_no}`,
            size: 'large',
            bold: true,
            justification: 'center',
          },
          {
            text: `Order by: ${this.confirmedOrder.ordered_by}`,
            size: 'normal',
            bold: true,
            justification: 'center',
          }
        ];
        return content;
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
        if(this.confirmedOrder.order_no){
          content.push({
                text: `Order No: ${this.confirmedOrder.order_no}`,
                size: 'large',
                bold: true,
                justification: 'center',
          })
        }
        return content;
    }

    getCounterPrintableText(counters) {
      let sectionSeperatorCharacters = '-'.repeat(42);
      let countersWithOrders = [];
      debugger
      if(counters.length > 0){
        counters.forEach((counterEle) => {
          let counterItemList = this.confirmedOrder.order_list.filter(
            (lineItem: lineItem) => lineItem.counter.counter_id == counterEle.counter_id);
          if (counterItemList.length) {
            let printObj = [
              {
                text: this.sessionWrapper.getItem('restaurant_name'),
                justification: 'center',
                size: 'xlarge',
                bold: true,
              },
              {
                text: this.dateUtils.getDateForRecipePrint(),
                justification: 'right',
              },
              {
                text: counterEle.counter_name,
                justification: 'center',
                size: 'xlarge',
              },
              {
                text: sectionSeperatorCharacters,
                justification: 'center',
              },
              {
                text: this.getFormattedCounterItemDetails(counterItemList),
                size: 'xlarge', 
              },
              {
                text: sectionSeperatorCharacters,
                justification: 'center',
              },
            ];
            if(this.confirmedOrder.order_no){
              printObj.push({
                    text: `Order No: ${this.confirmedOrder.order_no}`,
                    size: 'large',
                    bold: true,
                    justification: 'center',
              })
            }
            countersWithOrders.push(printObj);
          }
        });
        return countersWithOrders
      }
      else{
        let printObj = [
          {
            text: this.sessionWrapper.getItem('restaurant_name'),
            justification: 'center',
            size: 'xlarge',
            bold: true,
          },
          {
            text: this.dateUtils.getDateForRecipePrint(),
            justification: 'right',
          },
          {
            text: sectionSeperatorCharacters,
            justification: 'center',
          },
          {
            text: this.getFormattedCounterItemDetails(this.confirmedOrder.order_list),
            size: 'xlarge', 
          },
          {
            text: sectionSeperatorCharacters,
            justification: 'center',
          },
        ];
        if(this.confirmedOrder.order_no){
          printObj.push({
                text: `Order No: ${this.confirmedOrder.order_no}`,
                size: 'large',
                bold: true,
                justification: 'center',
          })
        }
        countersWithOrders.push(printObj);
        return countersWithOrders
      }
    }

    
  private getFormattedCounterItemDetails(counterItemList) {
      let formattedText = '';
      counterItemList.forEach((element) => {
        let trimmedName = this.getFixedLengthString(element.item_name.substring(0, 16), 16, false, ' ')
        let remainingName = trimmedName.trim() == element.item_name ? '' : ' ' + this.getFixedLengthString(element.item_name.substring(16, 36), 20, false, ' ') + '\n';
        let itemQty = this.getFixedLengthString(element.quantity, 3, true, ' ');
        formattedText += `- ${trimmedName}  ${itemQty}\n${remainingName}`
      })
      return formattedText
    }
    
    private getFormattedDineInItemDetails() {
    let formattedTable = '';
    this.confirmedOrder.order_list.forEach((lineItem: lineItem, index) => {
      if (lineItem.quantity > 0) {
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
        let itemQty = this.getFixedLengthString(lineItem.quantity, 3, true, ' ');
        let itemPrice = this.getFixedLengthString(lineItem.price, 4, true, ' ');
        let itemAmount = this.getFixedLengthString(
            lineItem.quantity * lineItem.price,
          4,
          true,
          ' '
        );
        formattedTable += `-${trimmedName}  ${itemQty}  ${itemPrice}  ${itemAmount}\n${remainingName}`;
      }
    });
    return formattedTable;
    }

    private getFormattedParcelItemDetails() {
      let inititalString = '------------------Parcel------------------\n';
      let formattedTable = inititalString;
      let totalParcelItem = 0;
      this.confirmedOrder.order_list.forEach((element: any) => {
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

    private getGstDetails() {
      let gstAmount = (this.confirmedOrder.total_amount * 0.05).toFixed(2); //check total amount /amount
      return `GST @ 5%: Rs.${gstAmount}`;
    }

    private getTotalAmount() {
      return `Total Amount: Rs.${this.calculateTotalAmount()}`;
    }

    private getFormattedCurrentDate() {
      return this.dateUtils.getDateForRecipePrint();
    }

    private calculateTotalAmount() {
      let total = 0;
      this.confirmedOrder.order_list.forEach((lineItem: lineItem) => { // check itemlist vs item_list
        total += lineItem.price * (lineItem.quantity + (lineItem.parcel_quantity? lineItem.parcel_quantity: 0));
      });
      return total;
    }

    private getFixedLengthString(string, length, prefix = true, fixValue = '0') {
      string = String(string);
      console.log('string length', string.toLocaleString().length);
      return string.length > length
        ? string.substring(0, length)
        : prefix
        ? fixValue.repeat(length - string.length) + string
        : string + fixValue.repeat(length - string.length);
    }

}