import { Injectable } from "@angular/core";
import { confirmedOrder, lineItem } from "../datatypes/orders";
import { meAPIUtility } from "../site-variable";
import { dateUtils } from "./date_utils";


@Injectable({
    providedIn: 'root'
  })
export class ReceiptPrintFormatter{

    constructor(
        private meUtility: meAPIUtility, 
        private dateUtils: dateUtils
    ){

    }
    private restaurantName
    private restaurantAddress
    private restaurantGST
    private isGSTInclusive
    private confirmedOrder

    set confirmedOrderObj(confirmedOrder: confirmedOrder){
      this.meUtility.getRestaurant().subscribe(
        (restaurant) => {
          this.restaurantName = restaurant['restaurant_name']
          this.restaurantAddress = restaurant['restaurant_address']
          this.restaurantGST = restaurant['restaurant_gst']
          this.isGSTInclusive = restaurant['tax_inclusive']
        }
      )
        this.confirmedOrder = confirmedOrder
    }

    getKOTReceiptText(counters){
      let sectionSeperatorCharacters = '-'.repeat(42);
      let printObjs = []
      if(counters.length > 0){
        counters.forEach((counterEle) => {
          let counterItemList = this.confirmedOrder.order_list.filter(
            (lineItem: lineItem) => lineItem.counter.counter_id == counterEle.counter_id);
          if (counterItemList.length) {
            let counterObjs = [
              {
                text: 'Kitchen KOT',
                justification: 'center',
              },
              {
                text: this.confirmedOrder.ordered_time,
                justification: 'right',
                size: 'small'
              },
              {
                text: sectionSeperatorCharacters,
                justification: 'center',
              },
              {
                text: this.getFormattedCounterItemDetails(counterItemList),
                justification: 'left',
              },
              {
                text: sectionSeperatorCharacters,
                justification: 'center',
              },
              {
                text: counterEle.counter_name,
                justification: 'center',
                bold: true
              },
            ]
            if(this.confirmedOrder.table_name) counterObjs.push({
              text: this.confirmedOrder.table_name,
              justification: 'center',
            })
            printObjs.push(counterObjs)
          } 
          })
        }else{
          let printObj = [
            {
              text: 'Kitchen KOT',
              justification: 'center',
            },
            {
              text: this.confirmedOrder.ordered_time,
              justification: 'right',
              size: 'small'
            },
            {
              text: sectionSeperatorCharacters,
              justification: 'center',
            },
            {
              text: this.getFormattedCounterItemDetails(this.confirmedOrder.order_list),
              justification: 'left',
            },
            {
              text: sectionSeperatorCharacters,
              justification: 'center',
            },
            {
              text: this.confirmedOrder.table_name,
              justification: 'center',
            },
          ]
          printObjs.push(printObj)
      }
      return printObjs
    }

    getWKOTReceiptText(counters){
      let sectionSeperatorCharacters = '-'.repeat(42);
      let printObjs = []
      if(counters.length > 0){
        counters.forEach((counterEle) => {
          let counterItemList = this.confirmedOrder.order_list.filter(
            (lineItem: lineItem) => lineItem.counter.counter_id == counterEle.counter_id);
          if (counterItemList.length) {
            let counterObjs = [
              {
                text: 'Waiter KOT',
                justification: 'center',
              },
              {
                text: this.confirmedOrder.ordered_time,
                justification: 'right',
                size: 'small'
              },
              {
                text: this.getFormattedCounterItemDetails(counterItemList),
                justification: 'left',
              },
              {
                text: sectionSeperatorCharacters,
                justification: 'center',
              },
              {
                text: this.confirmedOrder.table_name,
                justification: 'center',
              },
              {
                text: counterEle.counter_name,
                justification: 'center',
              },
              {
                text: ' '.repeat(20) + 'X' + ' '.repeat(20),
                justification: 'center',
              },
            ]
            printObjs.push(counterObjs)
          } 
          })
        }else{
          let printObj = [
            {
              text: 'Waiter KOT',
              justification: 'center',
            },
            {
              text: this.confirmedOrder.ordered_time,
              justification: 'right',
              size: 'small'
            },
            {
              text: this.getFormattedCounterItemDetails(this.confirmedOrder.order_list),
              justification: 'left',
            },
            {
              text: sectionSeperatorCharacters,
              justification: 'center',
            },
            {
              text: this.confirmedOrder.table_name,
              justification: 'center',
            },
            {
              text: ' '.repeat(20) + 'X' + ' '.repeat(20),
              justification: 'center',
            },
          ]
          printObjs.push(printObj)
      }
      return printObjs
    }

    getCustomerPrintableText() {
        let sectionHeader1 =
          '-'.repeat(16) + `${this.confirmedOrder.payment_mode.toUpperCase()}` + '-'.repeat(16);
        let tableHeader = '       DESCRIPTION         QTY  RATE   AMT';
        let endNote = 'Thank you. Visit again';
        let sectionSeperatorCharacters = '-'.repeat(42);
        let content = [
          {
            text: this.restaurantName,
            justification: 'center',
            bold: true,
            size: 'xlarge',
          },
          {
            text: this.restaurantAddress.replace(/-/gi, '\n'),
            justification: 'center',
            bold: true,
          },
          {
            text: sectionHeader1,
            bold: true,
            justification: 'center',
          },
          {
            text: this.dateUtils.getDateForRecipePrint(),
            justification: 'right',
          },
          {
            text: sectionSeperatorCharacters,
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
            text: this.getSubTotalStrint(),
            justification: 'right'
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
            text: this.restaurantGST,
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

    getWaiterCheckKOTText(counters){
      let sectionSeperatorCharacters = '-'.repeat(42);
      let content = [
        {
          text: this.dateUtils.getDateForRecipePrint(),
          justification: 'right',
          size: 'small'
        },
        {
          text: this.confirmedOrder.table_name,
          justification: 'center',
        },
      ]
      if(this.confirmedOrder.waiter_name) content.push({
          text: this.confirmedOrder.waiter_name,
          justification: 'center',
        })
      content.push({
        text: sectionSeperatorCharacters,
        justification: 'center',
      })
      if(counters.length > 0){
        counters.forEach((counterEle) => {
          let counterItemList = this.confirmedOrder.order_list.filter(
            (lineItem: lineItem) => lineItem.counter.counter_id == counterEle.counter_id);
          if (counterItemList.length) {
            let counterText = [
              {
                text: counterEle.counter_name,
                justification: 'center',
                size: 'large',
              },
              {
                text: this.getFormattedCounterItemDetails(counterItemList),
                justification: 'left',
                size: 'large',
              },
              {
                text: sectionSeperatorCharacters,
                justification: 'center',
                size: 'large',
              }
            ]
            counterText.forEach(ele => content.push(ele))
          }  
          })
        }else{
        let printObj = [
          {
            text: this.getFormattedCounterItemDetails(this.confirmedOrder.order_list),
            justification: 'left',
            size: 'small',
          },
          {
            text: sectionSeperatorCharacters,
            justification: 'center',
            size: 'small',
          },
        ];
        printObj.forEach(ele => content.push(ele))
      }
      return content
    }

    getCounterPrintableText(counters) {
      let sectionSeperatorCharacters = '-'.repeat(42);
      let countersWithOrders = [];
      if(counters.length > 0){
        counters.forEach((counterEle) => {
          let counterItemList = this.confirmedOrder.order_list.filter(
            (lineItem: lineItem) => lineItem.counter.counter_id == counterEle.counter_id);
          if (counterItemList.length) {
            let printObj = [
              {
                text: this.restaurantName,
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
            if(this.confirmedOrder.table_name){
              printObj.push({
                text: `Table: ${this.confirmedOrder.table_name}`,
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
            text: this.restaurantName,
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
        let trimmedName = this.getFixedLengthString(element.item_name.substring(0, 30), 30, false, ' ')
        let remainingName = trimmedName.trim() == element.item_name ? '' : ' ' + this.getFixedLengthString(element.item_name.substring(30, 60), 30, false, ' ') + '\n';
        let itemQty = this.getFixedLengthString(element.quantity, 3, true, ' ');
        formattedText += `- ${trimmedName}  ${itemQty}\n${remainingName}`
        if(element.note) formattedText += `(${element.note})`
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
      if(this.isGSTInclusive){
        let gstAmount = (this.confirmedOrder.total_amount * 0.05).toFixed(2); //check total amount /amount
        return `GST inclusive @ 5%: Rs.${gstAmount}`;
      }else{
        let gstAmount = `SGST (2.5%): ${this.calculateGSTcomponents()/2}\nCGST (2.5%): ${this.calculateGSTcomponents()/2}`
        return gstAmount
      }
    }

    private calculateGSTcomponents(){
      let gsttotal = 0;
      this.confirmedOrder.order_list.forEach((lineItem: lineItem) => { // check itemlist vs item_list
        let gstValue = (lineItem.tax_inclusive? 0 : (Math.round(((lineItem.price * 0.05) + Number.EPSILON) * 100) / 100))
        gsttotal += (gstValue * (lineItem.quantity + (lineItem.parcel_quantity? lineItem.parcel_quantity: 0)));
      });
      return Number(gsttotal.toFixed(2));
    }

    private getSubTotal(){
      let amount = this.isGSTInclusive? this.calculateTotalAmountTaxInclusive(): this.calculateTotalAmountTaxExclusive()
      return amount
    }

    private getTotalAmount() {
      let subTotal = this.getSubTotal()
      let amountRounded = Math.round((subTotal + Number.EPSILON) * 100) / 100 // 2 digits        2.5
      let amountRoundedToNextInteger = Math.round(subTotal) // integer -> floor, ceil            3
      let roundOffAmount =  amountRoundedToNextInteger - amountRounded // round off difference 0.5
      return `Total Amount: Rs.${amountRoundedToNextInteger}`;    // 0.5, 3
    }

    private getSubTotalStrint(){
      let subTotal = this.getSubTotal()
      let amountRounded = Math.round((subTotal + Number.EPSILON) * 100) / 100 // 2 digits        2.5
      let amountRoundedToNextInteger = Math.round(subTotal) // integer -> floor, ceil            3
      let roundOffAmount =  amountRoundedToNextInteger - amountRounded // round off difference 0.5
      return `Sub-total: ${amountRounded}\nRound off: ${roundOffAmount}`;    // 0.5, 3
    }

    private getFormattedCurrentDate() {
      return this.dateUtils.getDateForRecipePrint();
    }

    private calculateTotalAmountTaxInclusive() {
      let total = 0;
      this.confirmedOrder.order_list.forEach((lineItem: lineItem) => { // check itemlist vs item_list
        total += lineItem.price * (lineItem.quantity + (lineItem.parcel_quantity? lineItem.parcel_quantity: 0));
      });
      return total;
    }
    private calculateTotalAmountTaxExclusive() {
      let total = 0;
      this.confirmedOrder.order_list.forEach((lineItem: lineItem) => { // check itemlist vs item_list
        total += (lineItem.tax_inclusive? lineItem.price: (lineItem.price * 1.05)) * (lineItem.quantity + (lineItem.parcel_quantity? lineItem.parcel_quantity: 0));
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