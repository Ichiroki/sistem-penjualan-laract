import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";
import axios from 'axios';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend)

function DeliveriesDetail({ delivery, auth }) {

    const [target, setTarget] = useState<any>([])
    const [code, setCode] = useState([])
    const [codeData, setCodeData] = useState([])

    useEffect(() => {
        const uniqueCode: any = [...new Set(delivery.map(p => p.product_code))]
        setCode(uniqueCode)
    }, [delivery])


    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`/deliveries/${code}`)
                .then((res) => {
                    const getData = res.data

                    const targetProd = {}

                    getData.forEach(data => {
                        const productCode = data.product_code

                        if(targetProd[productCode]) {
                            targetProd[productCode] += data.target_delivery
                        } else {
                            targetProd[productCode] = data.target_delivery
                        }
                    })

                    setCodeData(targetProd)
                })
            } catch(e) {
                console.log(e)
            }
        }

        fetchData()
    }, [code])

    const data = {
        labels: code,
        datasets: [
            {
                label: 'Quantity',
                data: codeData,
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
                ],
                borderColor: '#a1a1a1',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        // animation: false
    }

    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
            >
                <Head title="Dashboard" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {/* Tampilkan chart */}
                                <Doughnut data={data} width={500} height={500} options={options}/>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

export default DeliveriesDetail;
