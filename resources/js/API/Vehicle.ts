import { Vehicle } from "@/types/Vehicle"
import axios from 'axios'
import { useEffect, useState } from "react"

export function Vehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])

    const [search, setSearch] = useState('')

    let getVehiclesData = async () => {
        try {
            if(search) {
                await axios.get(`/vehicles?search=${search}`).then((res) => { setVehicles(res.data) })
            } else {
                await axios.get('/vehicles').then((res) => { setVehicles(res.data) })
            }
        } catch (e) { console.error('Internal Server error, please wait' + e) }
    }

    useEffect(() => { getVehiclesData() }, [search])

    return { vehicles, setVehicles, search, setSearch, getVehiclesData}
}
