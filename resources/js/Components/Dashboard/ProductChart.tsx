import { useEffect, useState } from "react";
import PieChart from "../PieChart";
import axios from "axios";
import { Product } from "@/API/Product";

function ProductChart() {
    const { product } = Product()
    const [code, setCode] = useState([])
    const [codeData, setCodeData] = useState([])

    useEffect(() => {
        const uniqueCode: any = [...new Set(product.map(p => p.code))]
        setCode(uniqueCode);
    }, [product]);

    let getProductDataByCode = async (code) => {
        try {
            const response = await axios.get(`/products/${code}`)
            const quantity = response.data.quantity;
            setCodeData((prevData): any => [...prevData, quantity])
        } catch (e) {
            console.error('Internal Server error, please wait' + e)
        }
    }

    useEffect(() => {
        code.forEach(code => getProductDataByCode(code))
    }, [code])

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

    return (
        <>
            <div className="flex">
                <div className='w-1/2'>
                    <PieChart data={chartData} title='Jumlah Produk' endpoint={'products'}/>
                </div>
                <div></div>
            </div>
        </>
    );
}

export default ProductChart;
