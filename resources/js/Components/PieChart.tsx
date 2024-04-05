import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

function PieChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {},
    });
  }, [data]);

  return <canvas ref={chartRef} />;
}

export default PieChart;
