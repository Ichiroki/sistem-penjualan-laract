import { Product } from "./Product"
import { Vehicle } from "./Vehicle"

export interface Delivery {
    id: number
    vehicle: Vehicle
    product_code: string
    product: Product
    quantity: number
    target_delivery: number
    actual_delivery: number
    percentage: number
}
