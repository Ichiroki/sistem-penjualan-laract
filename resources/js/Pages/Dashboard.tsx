import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import PieChart from '@/Components/PieChart'
import { useEffect, useState } from 'react'
import { Product } from '@/API/Product';
import { randomRGB } from '@/utils/RandomRGB';

export default function Dashboard({ auth }: PageProps) {
    const { product } = Product()
    const [code, setCode] = useState([])
    const [codeData, setCodeData] = useState([])

    // random color generate for Chart
    // const [rdmColor, setRdmColor] = useState<any>([])
    // let rdmColor: any = []

    // for(let i = 0; i < product.length; i++) {
    //     rdmColor[i] += randomRGB()
    // }

    useEffect(() => {
        const uniqueCode: any = [...new Set(product.map(p => p.code))];
        setCode(uniqueCode);
    }, [product]);

    let getProductDataByCode = async (code) => {
        try {
            const response = await axios.get(`/products/${code}`);
            console.log(response.data);
            const quantity = response.data.quantity;
            setCodeData((prevData): any => [...prevData, quantity]);
        } catch (e) {
            console.error('Internal Server error, please wait' + e);
        }
    }

    useEffect(() => {
        // Ambil data kuantitas setiap kali code berubah
        code.forEach(code => getProductDataByCode(code));
    }, [code]);

    console.log(codeData);

    const chartData = {
        labels: code,
        datasets: [
            {
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
                ]
            }
        ]
    };

    // const chartData = {
    //     labels: code,
    //     datasets: [
    //         {
    //             data: codeData,
    //             backgroundColor: rdmColor
    //         }
    //     ]
    // }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex">
                                <div className='w-1/2'>
                                    <PieChart data={chartData} title='Jumlah Produk'/>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
