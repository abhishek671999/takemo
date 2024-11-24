export type getMultilocationSalesAnalytics = {
    "time_frame": string,
    "start_date"?: string,
    "end_date"?: string
}

export type multilocationSalesAnalytics = {
    restaurnat_name: string,
    total_quantity: number,
    total_amount: number
    total_making_price: number,
    total_amount_without_tax: number,
    total_gst_amount: number
}