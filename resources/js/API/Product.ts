import { useEffect, useState } from "react"
import axios from 'axios'
import { Product } from "@/types/Product"

export function Product () {
    const [product, setProduct] = useState<Product[]>([])

    const [search, setSearch] = useState('')

    let getProductData = async () => {
        try {
            if(search) {
                axios.get(`/products?search=${search}`).then(response => setProduct(response.data))
            } else {
                axios.get(`/products/`).then(response => setProduct(response.data.data))
            }
        } catch (e) {
            console.error('Internal Server error, please wait' + e)
        }
    }

    useEffect(() => {
        getProductData()
    }, [search])

    return {
        product,
        setProduct,
        search,
        setSearch,
        getProductData
    }
}
