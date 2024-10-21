import { Delivery } from "./Delivery"
import { Product } from "./Product"

export interface Incoming {
    invoice: string
    supplier_name: string
    received_to: string
    number_plates: string
    product: [Product]
}
