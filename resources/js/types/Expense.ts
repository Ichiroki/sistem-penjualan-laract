import { Delivery } from "./Delivery"
import { Product } from "./Product"

export interface Expense {
    id: number
    input_date: string
    number_plates: string
    delivery: Delivery
    product_code: string
    product: Product
    quantity: number
}
