import { useEffect, useState } from "react"
import axios from 'axios'
import { Delivery } from "@/types/Delivery"

export function Delivery() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([])

    const [search, setSearch] = useState('')

    let getDeliveriesData = async () => {
        try {
        if(search) {
            await axios.get(`/deliveries?search=${search}`)
            .then((res) => {
                console.log(res.data)
                setDeliveries(res.data)
            })
        } else {
            await axios.get('/deliveries')
            .then((res) => {
                console.log(res.data)
                setDeliveries(res.data)
            })
        }
        } catch (e) {
            console.error('Internal Server error, please wait' + e)
        }
    }

    useEffect(() => {
        getDeliveriesData()
    }, [search])

    return {
        deliveries,
        setDeliveries,
        search,
        setSearch,
        getDeliveriesData
    }
}
