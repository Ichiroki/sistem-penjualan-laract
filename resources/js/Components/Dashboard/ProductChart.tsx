import { Product } from "@/API/Product"
import axios from "axios"
import Chart from "chart.js/auto"
import { useEffect, useRef, useState } from "react"
import Modal from "../Modal"

interface ProductDataType {
    code?: string
    name?: string
    quantity?: number
}

function ProductChart() {
    const { product } = Product();
    const [code, setCode] = useState([]);

    const [prodName, setProdName] = useState([])

    const [codeData, setCodeData] = useState([]);
    const [show, setShow] = useState(false);

    const [data, setData] = useState<ProductDataType | undefined>(undefined);

    const chartRef = useRef<any>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        const uniqueCode: any = [...new Set(product.map(p => p.code))];
        setCode(uniqueCode);

        const uniqueName: any = [...new Set(product.map(p => p.name))]
        setProdName(uniqueName)
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = code.map(code => axios.get(`/products/${code}`));
                const responses = await Promise.all(promises);
                const newData: any = responses.map(res => res.data.quantity);
                setCodeData(newData);
            } catch (e) {
                console.error('Internal Server error, please wait' + e);
            }
        };

        fetchData();
    }, [code]);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const chartData = {
            labels: prodName,
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
        }

        const handleClick = async (event, elements) => {
            if (elements && elements.length > 0) {
                const clickedElement = elements[0]
                const dataIndex = clickedElement.index
                const clickedData = chartData.labels[dataIndex]
                try {
                        await axios.get(`products/${clickedData}`)
                        .then((res) => {
                            console.log(res.data)
                            setData(res.data)
                            setShow(!show)
                        })
                    } catch(e) {
                        console.log(e)
                    }
                }
            };

        chartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
                plugins: {
                    title: {
                        display: true,
                        text: 'Jumlah Produk'
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                },
                onClick: handleClick // Panggil event handler ketika potongan diklik
            },
        });
    }, [code, codeData, data, show]);

    return (
        <div className="flex">
            <canvas ref={chartRef} className="" />
            <Modal show={show} onClose={() => setShow(false)}>
                <div className='p-5'>
                    <div className='flex justify-between pb-4 border-b'>
                        <h1 className='text-medium text-xl'>Product Details</h1>
                        <button onClick={() => setShow(!show)}>X</button>
                    </div>
                    <ul>
                        <li>Code: {data?.code}</li>
                        <li>Name: {data?.name}</li>
                        <li>Quantity: {data?.quantity}</li>
                    </ul>
                </div>
            </Modal>
        </div>
    );
}

export default ProductChart;
