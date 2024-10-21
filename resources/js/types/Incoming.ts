import { Delivery } from "./Delivery"
import { Product } from "./Product"

export interface Incoming {
    invoice: string
    delivery_name: string
    customer_name: string
    customer_address: string
    batch_number: string
    input_date: string
    product: [Product]
}
