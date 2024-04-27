import { Delivery } from "@/API/Delivery";
import axios from "axios";
import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { Doughnut } from "react-chartjs-2";
import Button from "../Button";

type codeDataType = {
    code?: string
    name?: string
    actual_delivery: number
    percentage: number
}

function DeliveriesChart() {
    const { deliveries } = Delivery();
    const [numberPlates, setNumberPlates] = useState([]);
    const [numberPlatesData, setNumberPlatesData] = useState([]);

    const [code, setCode] = useState([])
    const [codeData, setCodeData] = useState<codeDataType[]>([])

    const [show, setShow] = useState(false)

    const chartRef = useRef<any>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        const uniqueNumber: any = [...new Set(deliveries.map(p => p.vehicle.number_plates))];
        setNumberPlates(uniqueNumber);

        const uniqueCode: any = [...new Set(deliveries.map(p => p.product_code))]
        setCode(uniqueCode)
    }, [deliveries]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let targetDeliveryMap = {}; // Objek untuk menyimpan jumlah target_delivery

                await Promise.all(numberPlates.map(async (np) => {
                    await axios.get(`/deliveries/${np}`)
                        .then((res) => {
                            res.data.forEach((r) => {
                                const key = `${r.vehicle.number_plates}`; // Kombinasi number_plates
                                if (targetDeliveryMap[key]) {
                                    // Jika kunci sudah ada, tambahkan target_delivery
                                    targetDeliveryMap[key] += r.target_delivery;
                                } else {
                                    // Jika kunci belum ada, buat kunci baru
                                    targetDeliveryMap[key] = r.target_delivery;
                                }
                            });
                        });
                }));
                const newData: never[] = Object.values(targetDeliveryMap); // Ambil nilai dari objek sebagai array
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
                    label: 'Target Pengiriman',
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
            if (elements && elements.length > 0) {
                const clickedElement = elements[0];
                const dataIndex = clickedElement.index;
                const clickedData = chartData.labels[dataIndex];
                try {
                    await axios.get(`/deliveries/${clickedData}`)
                    .then((res) => {
                        const getData = res.data
                        let newData: codeDataType[] = []; // array baru untuk menyimpan data yang diterima dari server
                        getData.forEach((data) => {
                            const actual_delivery = parseFloat(data.actual_delivery)
                            const percentage = parseFloat(data.percentage)
                            newData.push({ actual_delivery, percentage }); // menambahkan data baru ke dalam array newData
                        });
                        setCodeData(newData); // set newData ke dalam state codeData
                        setShow(!show);
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }


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
    }, [numberPlates, numberPlatesData, code]);


    const handleClose = () => {
        setShow(false)
        setCodeData([])
    }

    const chartData = {
        labels: code,
        datasets: [{
                label: 'Actual Delivery',
                data: [{id: 'Actual Delivery', nested: {value: codeData.map(cd => cd.actual_delivery)}}],
                backgroundColor: [
                    '#06b6d4',
                    '#fb7185',
                    '#ffce56',
                    '#4ade80',
                ],
            }, {
                label: 'Percentage',
                data: [{id: 'Percentage', nested: {value: codeData.map(cd => cd.percentage)}}],
                backgroundColor: [
                    '#06b6d4',
                    '#fb7185',
                    '#ffce56',
                    '#4ade80',
                ]
            }
        ],
    };

    const options = {
        maintainAspectRatio: false,
        parsing: {
            key: 'nested.value'
        }
    }

    return (
        <>
            <div>
                {/* menggunakan tag html '<canvas></canvas>' untuk menampilkan chart beserta data yang dikirimkan */}
                <canvas ref={chartRef}/>
                <Modal show={show} onClose={() => handleClose()}>
                    <div className="p-5">
                        <div className='flex justify-between pb-4 border-b'>
                            <h1 className='text-medium text-xl'>Deliveries Chart</h1>
                            <button onClick={() => handleClose()}>X</button>
                        </div>
                        <div>
                            <Doughnut data={chartData} width={250} height={250} options={options}/>
                        </div>
                        <div className="flex justify-end mt-6 border-t">
                            <Button color="light" onClick={() => handleClose()}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default DeliveriesChart;

