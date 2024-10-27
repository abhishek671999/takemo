export type confirmedOrder = {
    "order_list": lineItem[]
    "payment_mode": string,
    "total_amount": number,
    "restaurant_id": number,
    "restaurant_name"?: string,
    "order_id"?: number,
    "order_no"?: number,
    "ordered_by"?: string,
    "done_time"?: string,
    "total_platform_fee"?: number,
    "parcel_charges"?: number,
    "is_delivered"?: boolean,
    "ordered_time"?: string,
    "shift"?: string,
    "refund_amount"?: number,
    "table_name"?: string,
    "waiter_name"?: string
}

export type lineItem = {
    "item_id": number,
    "item_name": string,
    "price": number,
    "quantity": number,
    "parcel_charges": number,
    "parcel": boolean,
    "item_unit_price_id": number,
    "parcel_quantity": number,
    counter?: counter
}

export type counter = {
    counter_id: number,
    counter_name: string
}

// let body = {
//     pos: true,
//     order_list: itemList,
//     table_id: Number(this.__sessionWrapper.getItem('table_id')),
//     restaurant_id: this.restaurantId,
//     payment_mode: this.modeOfPayment,
//     printer_conneted: this.printerConn.usbSought,
//     total_amount: this.summary.amount,
//     actual_total_amount: actualTotalAmount,
//   };