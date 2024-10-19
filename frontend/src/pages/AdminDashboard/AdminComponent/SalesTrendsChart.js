// SalesTrendsChart.js
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale, // Import CategoryScale
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

// Register the components
ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const SalesTrendsChart = ({ salesData }) => {
  const data = {
    labels: salesData.map((data) => data.date), // Dates for the x-axis
    datasets: [
      {
        label: "Sales Amount",
        data: salesData.map((data) => data.amount), // Sales amounts for the y-axis
        fill: false,
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderColor: "rgba(52, 152, 219, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-xl h-72 mx-auto">
      {" "}
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesTrendsChart;
