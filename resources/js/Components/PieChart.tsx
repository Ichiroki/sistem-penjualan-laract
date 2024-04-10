import Chart from "chart.js/auto"
import { useEffect, useRef, useState } from "react"
import Modal from "./Modal"
import axios from "axios"

function PieChart({ data, title = "Pie Chart", endpoint, children }) {

    const [selectedData, setSelectedData] = useState<any>(null)



    const [show, setShow] = useState(false)


  // Event handler untuk menghandle klik pada potongan chart





  return (
    <div>

      {children}
    </div>
  );
}

export default PieChart;
