import { Delivery } from "@/API/Delivery";
import axios from "axios";
import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { Doughnut } from "react-chartjs-2";

function DeliveriesChart() {
    const { deliveries } = Delivery();
    const [numberPlates, setNumberPlates] = useState([]);
    const [numberPlatesData, setNumberPlatesData] = useState([]);

    const [modalData, setModalData] = useState({
        code: '',
        name: '',
        quantity: ''
    })

    const [show, setShow] = useState(false)

    const chartRef = useRef<any>(null);
    const chartInstance = useRef<any>(null);

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

                const newData : never[] = Object.values(targetDeliveryMap); // Ambil nilai dari objek sebagai array
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

        // membuat object yang berisikan data yang dibutuhkan untuk menampilkan chart
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

        // membuat sistem clickable chart
        const handleClick = async (event, elements) => {

            // cek apakah elements tersebut ada dan memiliki panjang lebih dari 0
            if (elements && elements.length > 0) {

                // pilih element paling awal
                const clickedElement = elements[0]

                // ambil index dari element yang terpilih
                const dataIndex = clickedElement.index

                // ambil nilai di dalam variabel labels
                const clickedData = chartData.labels[dataIndex]

                // lakukan promise terhadap client
                try {
                    await axios.get(`/deliveries/${clickedData}`)
                    .then((res) => {
                        const getData = res.data
                        console.log(getData)

                        getData.forEach(e => {
                            setModalData({
                                code: e.product.code,
                                name: e.product.name,
                                quantity: e.product.quantity
                            })
                        })
                        setShow(!show)
                    })
                } catch(e) {
                    console.log(e)
                }
            }
        };


        // membuat instance untuk pemanggilan chart sesuai dengan kebutuhan
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


    const chartInModalData = {
        labels: ['1', '2', '3'],
        datasets: [
            {
                label: 'Quantity',
                data: [modalData.code, modalData.name, modalData.quantity],
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
            }
        ]
    }

    return (
        <>
            <div>
                {/* menggunakan tag html '<canvas></canvas>' untuk menampilkan chart beserta data yang dikirimkan */}
                <canvas ref={chartRef} className="" />
                <Modal show={show} onClose={() => setShow(!show)}>
                    <Doughnut data={chartInModalData} />
                </Modal>
            </div>
        </>
    );
}

export default DeliveriesChart;

