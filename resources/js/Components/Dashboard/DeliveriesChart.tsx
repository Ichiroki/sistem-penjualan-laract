import { Delivery } from "@/API/Delivery";
import axios from "axios";
import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

function DeliveriesChart() {
    const { deliveries } = Delivery();
    const [numberPlates, setNumberPlates] = useState([]);
    const [numberPlatesData, setNumberPlatesData] = useState([]);

    const chartRef = useRef<any>(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const uniqueCode: any = [...new Set(deliveries.map(p => p.number_plates))];
        setNumberPlates(uniqueCode);
    }, [deliveries]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const targetDeliveryMap = {}; // Objek untuk menyimpan jumlah target_delivery
                await Promise.all(numberPlates.map(async (np) => {
                    const res = await axios.get(`/deliveries/${np}`);
                    res.data.forEach((r) => {
                        const key = `${r.number_plates}_${r.product_code}`; // Kombinasi number_plates dan product_code sebagai kunci
                        if (targetDeliveryMap[key]) {
                            targetDeliveryMap[key] += r.target_delivery; // Jika kunci sudah ada, tambahkan target_delivery
                        } else {
                            targetDeliveryMap[key] = r.target_delivery; // Jika kunci belum ada, buat kunci baru
                        }
                    });
                }));

                const newData = Object.values(targetDeliveryMap); // Ambil nilai dari objek sebagai array
                setNumberPlatesData(newData); // Tetapkan newData ke dalam state numberPlatesData setelah semua pemanggilan selesai
            } catch (e) {
                console.error('Internal Server error, please wait', e);
            }
        };

        fetchData();
    }, [numberPlates]);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

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
        }

        const handleClick = async (event, elements) => {
            if (elements && elements.length > 0) {
                const clickedElement = elements[0]
                const dataIndex = clickedElement.index
                const clickedData = chartData.labels[dataIndex]
                try {
                    window.location.href = `/delivery/detail/${clickedData}`
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
                        text: 'Jumlah Pengiriman Produk'
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                },
                onClick: handleClick // Panggil event handler ketika potongan diklik
            },
        });
    }, [numberPlates, numberPlatesData]);


    return (
        <div className="flex">
            <div className='w-1/2'>
                <canvas ref={chartRef} className="" />
            </div>
        </div>
    );
}

export default DeliveriesChart;

