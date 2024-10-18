import { Product } from "./Product"
import { Vehicle } from "./Vehicle"

export interface Delivery {
    id: number
    delivery_invoice: String
    number_plates: string
    date_delivery: Date
    time_delivery: Date
    percentage: number
}
