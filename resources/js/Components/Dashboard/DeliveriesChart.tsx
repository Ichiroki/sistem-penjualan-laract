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
    quantity: number
}

type nameDataType = {
    name?: string
}

function DeliveriesChart() {
    const { deliveries } = Delivery()
    const [numberPlates, setNumberPlates] = useState([])
    const [numberPlatesData, setNumberPlatesData] = useState([])

    const prevNumberPlatesData = useRef([])

    const [code, setCode] = useState<codeDataType[]>([])
    const [codeData, setCodeData] = useState<codeDataType[]>([])

    const [prodName, setProdName] = useState<nameDataType[]>([])

    const [show, setShow] = useState(false)

    const chartRef = useRef<any>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        const uniqueNumber: any = [...new Set(deliveries.map(p => p.delivery_invoice))];
        setNumberPlates(uniqueNumber)
    }, [deliveries]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let targetDeliveryMap = {} // Objek untuk menyimpan jumlah target_delivery

                await Promise.all(numberPlates.map(async(np) => {
                    await axios.get(`/deliveries/${np}`)
                        .then((res) => {
                            const detail = res.data.details
                            detail.forEach((r) => {
                                const key = `${r.delivery_invoice}`
                                targetDeliveryMap[key] ? targetDeliveryMap[key] += r.quantity : targetDeliveryMap[key] = r.quantity
                            })
                        });
                }));
                const newData: never[] = Object.values(targetDeliveryMap) // Ambil nilai dari objek sebagai array
                setNumberPlatesData(newData); // Tetapkan newData ke dalam state numberPlatesData setelah semua pemanggilan selesai
            } catch (e) {
                console.error('Internal Server error, please wait', e);
            }
        };

        fetchData()
    }, [numberPlates])

    useEffect(() => {
        if (prevNumberPlatesData.current !== numberPlatesData) {
            prevNumberPlatesData.current = numberPlatesData
        }
    }, [numberPlatesData])


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
                        const getData = res.data.details
                        let newData: codeDataType[] = [] // array baru untuk menyimpan data yang diterima dari server
                        let nameData: nameDataType[] = []

                        // let uniqueCode: any = [...new Set(deliveries.map((d) => d.product_code))]

                        getData.forEach((data) => {

                            const quantity = parseFloat(data.quantity)
                            const name = data.product_name

                            // const percentage = parseFloat(data.percentage)
                            console.log(data)
                            newData.push({name, quantity})
                            nameData.push(name)
                            // setProdName({product_name})
                             // menambahkan data baru ke dalam array newData
                        });
                        setCodeData(newData) // set newData ke dalam state codeData
                        setProdName(nameData)
                        setShow(!show)
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }

        console.log(prodName)

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


    const handleClose = () => {
        setShow(false)
        setCodeData([])
        setCode([])
    }

    const chartData = {
        labels: prodName,
        datasets: [{
                label: 'Actual Delivery',
                data: codeData.map(cd => cd.quantity),
                backgroundColor: [
                    '#06b6d4',
                    '#fb7185',
                    '#ffce56',
                    '#4ade80',
                ],
            }
        ],
    };

    const options = {
        maintainAspectRatio: false,
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

