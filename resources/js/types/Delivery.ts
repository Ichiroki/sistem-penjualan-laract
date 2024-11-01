import { Product } from "./Product"
import { Vehicle } from "./Vehicle"

export interface Delivery {
    id: number
    delivery_invoice: string
    delivery_name: string
    customer_name: string
    customer_address: string
    number_plates: string
    batch_number: string
    date_delivery: Date
    time_delivery: Date
    percentage: number
}
