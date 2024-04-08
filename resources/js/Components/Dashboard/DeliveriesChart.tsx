import { Delivery } from "@/API/Delivery";
import axios from "axios";
import { useEffect, useState } from "react";
import PieChart from "../PieChart";

function DeliveriesChart() {
    const { deliveries } = Delivery()
    const [numberPlates, setNumberPlates] = useState([])
    const [numberPlatesData, setNumberPlatesData] = useState([])

    useEffect(() => {
        const uniqueData: any = [...new Set(deliveries.map(p => p.number_plates))]
        setNumberPlates(uniqueData);
    }, [deliveries]);

    let getDeliveriesDataByNumPlat = async (numberPlates) => {
        try {
            await axios.get(`/deliveries/${numberPlates}`)
            .then((res) => {
                const productCode = res.data.product
                // console.log(productCode)
                setNumberPlatesData((prevData): any => [...prevData, productCode])
            })
        } catch (e) {
            console.error('Internal Server error, please wait' + e)
        }
    }

    useEffect(() => {
        numberPlates.forEach(id => getDeliveriesDataByNumPlat(id))
    }, [numberPlates])

    const chartData = {
        labels: numberPlates,
        datasets: [
            {
                data: numberPlatesData,
                backgroundColor: [
                    '#06b6d4',
                    '#fb7185',
                    '#ffce56',
                    '#4ade80',
                    '#7c3aed',
                    '#0e7490',
                    '#d97706',
                    '#f97316',
                    '#059669'
                ]
            }
        ]
    };

    return (
        <>
            <div className="flex">
                <div className='w-1/2'>
                    <PieChart data={chartData} title='Jumlah Pengantaran Barang' endpoint={'deliveries'} />
                </div>
                <div></div>
            </div>
        </>
    );
}

export default DeliveriesChart;
