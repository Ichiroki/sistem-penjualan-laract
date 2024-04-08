import Chart from "chart.js/auto"
import { useEffect, useRef, useState } from "react"
import Modal from "./Modal"
import axios from "axios"

function PieChart({ data, title = "Pie Chart", endpoint }) {
    const chartRef: any = useRef(null)
    const chartInstance: any = useRef(null)
    const [selectedData, setSelectedData] = useState<any>(null)

    const [show, setShow] = useState(false)

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        if (chartInstance.current) {
        chartInstance.current.destroy();
    }

  // Event handler untuk menghandle klik pada potongan chart
    const handleClick = async (event, elements) => {
        if (elements && elements.length > 0) {
        const clickedElement = elements[0]
        const dataIndex = clickedElement.index
        const clickedData = data.labels[dataIndex]
        try {
                await axios.get(`${endpoint}/${clickedData}`)
                .then((res) => {
                    setSelectedData(res.data)
                    setShow(!show)
                })
            } catch(e) {
                console.log(e)
            }
        }
    };

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            title: {
                display: true,
                text: title
            },
            legend: {
              display: true,
              position: 'right'
            }
        },
        onClick: handleClick // Panggil event handler ketika potongan diklik
      },
    });
  }, [data]);


  return (
    <div>
      <canvas ref={chartRef} className="" />
      {/* Tampilkan modal box ketika data potongan yang dipilih tidak null */}
      {selectedData && (
        <Modal show={show} onClose={() => setShow(false)}>
            <div className='p-5'>
                <div className='flex justify-between pb-4 border-b'>
                    <h1 className='text-medium text-xl'>Product Details</h1>
                    <button onClick={() => setShow(!show)}>X</button>
                </div>
                <ul>
                    <li>code {selectedData.code}</li>
                    <li>product name {selectedData.name}</li>
                    <li>quantity {selectedData.quantity}</li>
                </ul>
            </div>
        </Modal>
      )}
    </div>
  );
}

export default PieChart;
