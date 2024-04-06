import { Product } from "./Product"

export interface Delivery {
    id: string
    number_plates: string
    vehicle_type: string
    product_code: string
    product: Product
    target_delivery: number
}
