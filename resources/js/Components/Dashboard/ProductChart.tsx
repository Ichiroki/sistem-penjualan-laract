import { useEffect, useRef, useState } from "react";
import PieChart from "../PieChart";
import axios from "axios";
import { Product } from "@/API/Product";
import Modal from "../Modal";
import Chart from "chart.js/auto";

function ProductChart() {
    const { product } = Product();
    const [code, setCode] = useState([]);
    const [codeData, setCodeData] = useState([]);
    const [show, setShow] = useState(false);

    const [data, setData] = useState([]);

    const chartRef = useRef<any>(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const uniqueCode: any = [...new Set(product.map(p => p.code))];
        setCode(uniqueCode);
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
        }

        const handleClick = async (event, elements) => {
            if (elements && elements.length > 0) {
                const clickedElement = elements[0]
                const dataIndex = clickedElement.index
                const clickedData = chartData.labels[dataIndex]
                try {
                        await axios.get(`products/${clickedData}`)
                        .then((res) => {
                            setData(res.data)
                            setShow(!show)
                        })
                    } catch(e) {
                        console.log(e)
                    }
                }
            };

        chartInstance.current = new Chart(ctx, {
            type: "pie",
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
            <div className='w-1/2'>
                <canvas ref={chartRef} className="" />
                <Modal show={show} onClose={() => setShow(false)}>
                    <div className='p-5'>
                        <div className='flex justify-between pb-4 border-b'>
                            <h1 className='text-medium text-xl'>Product Details</h1>
                            <button onClick={() => setShow(!show)}>X</button>
                        </div>
                        <ul>
                            <li>{data.code}</li>
                            <li>{data.name}</li>
                            <li>{data.quantity}</li>
                        </ul>
                    </div>
                </Modal>
            </div>
            <div></div>
        </div>
    );
}

export default ProductChart;
