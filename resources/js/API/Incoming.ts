import { Incoming } from "@/types/Incoming"
import axios from 'axios'
import { useEffect, useState } from "react"

export function Incoming() {
    const [incomings, setIncomings] = useState<Incoming[]>([])

    const [search, setSearch] = useState('')

    let getIncomingsData = async () => {
        try {
        if(search) {
            await axios.get(`/incomings?search=${search}`)
            .then((res) => {
                console.log(res.data)
                setIncomings(res.data)
            })
        } else {
            await axios.get('/incomings')
            .then((res) => {
                console.log(res.data)
                setIncomings(res.data)
            })
        }
        } catch (e) {
            console.error('Internal Server error, please wait' + e)
        }
    }

    useEffect(() => {
        getIncomingsData()
    }, [search])

    return {
        incomings,
        setIncomings,
        search,
        setSearch,
        getIncomingsData
    }
}
