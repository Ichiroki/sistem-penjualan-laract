import { Delivery } from "./Delivery"
import { Product } from "./Product"

export interface Incoming {
    id: number
    input_date: string
    delivery: Delivery
    product: Product
}
