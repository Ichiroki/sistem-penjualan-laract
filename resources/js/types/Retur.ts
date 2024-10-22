import { Product } from "./Product"

export interface Retur {
    retur_invoice: string
    retur_name: string
    customer_name: string
    customer_address: string
    number_plate: string
    date_retur: Date
    time_retur: Date
    batch_number: string
    product: [Product]
}
