import {Retur} from '@/types/Retur'
import axios from 'axios'
import { useEffect, useState } from "react"

export function Retur() {
    const [returs, setReturs] = useState<Retur[]>([])

    const [search, setSearch] = useState('')

    let getRetursData = async () => {
        try {
            if(search) {
                await axios.get(`/returs?search=${search}`)
            } else {
                await axios.get('/returs').then((res) => { setReturs(res.data) })
            }
        } catch (e) {
            console.error('Internal Server error, please wait' + e)
        }
    }

    useEffect(() => {
        getRetursData()
    }, [search])

    return {
        returs,
        setReturs,
        search,
        setSearch,
        getRetursData
    }
}
