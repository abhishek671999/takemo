export type getMultilocationSalesAnalytics = {
    "time_frame": string,
    "start_date"?: string,
    "end_date"?: string
}

export type multilocationSalesAnalytics = {
    restaurnat_name: string,
    total_quanity: number,
    total_amount: number
}