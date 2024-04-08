import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

function PieChart({ data, title = "Pie Chart" }) {
  const chartRef: any = useRef(null);
  const chartInstance: any = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

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
      },
    });
  }, [data]);

  return <canvas ref={chartRef} className=""/>;
}

export default PieChart;
