import { useEffect, useState } from "react"
import axios from 'axios'
import { Expense } from "@/types/Expense"

export function Expense() {
    const [expenses, setExpenses] = useState<Expense[]>([])

    const [search, setSearch] = useState('')

    const getExpensesData = async () => {
        try {
            if(search) {
                await axios.get(`/expenses?search=${search}`)
                .then((res) => {
                    setExpenses(res.data)
                })
                .catch((e) => {
                    console.log('I think the endpoint with this request cannot fetch the data, here is the error ' + e)
                })
            } else {
                await axios.get('/expenses')
                .then((res) => {
                    setExpenses(res.data)
                })
                .catch((e) => {
                    console.log('I think the endpoint cannot fetch the data, here is the error ' + e)
                })
            }
        } catch(e) {
            console.log('Internal Server Error, Please Wait ' + e)
        }
    }

    useEffect(() => {
        getExpensesData()
    }, [search])

    return {
        expenses,
        setExpenses,
        search,
        setSearch,
        getExpensesData
    }
}
