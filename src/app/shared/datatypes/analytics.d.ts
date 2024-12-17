export type getMultilocationSalesAnalytics = {
    "time_frame": string,
    "start_date"?: string,
    "end_date"?: string
}

export type multilocationSalesAnalytics = {
    [x: string]: any
    upi_amount: number,
    card_amount: number,
    cash_amount: number,
    PayLater_amount: number,
    restaurnat_name: string,
    total_quantity: number,
    total_amount: number
    total_making_price: number,
    total_amount_without_tax: number,
    total_gst_amount: number,
    daily_average: number
}