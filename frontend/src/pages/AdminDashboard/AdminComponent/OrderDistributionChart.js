import React from "react";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, Tooltip, Legend);

const OrderDistributionChart = ({ orderData }) => {
  // Define colors for each status
  const statusColors = {
    pending: "#3498db",
    payment_processing: "#f39c12",
    payment_failed: "#e74c3c",
    processing: "#e67e22",
    shipped: "#2ecc71",
    delivered: "#27ae60",
    completed: "#9b59b6",
    canceled: "#e74c3c",
    returned: "#f1c40f",
    refunded: "#95a5a6",
  };

  // Prepare chart data
  const data = {
    labels: orderData.map(
      (order) =>
        order.status.charAt(0).toUpperCase() +
        order.status.slice(1).replace(/_/g, " ")
    ), // Capitalize and format labels
    datasets: [
      {
        data: orderData.map((order) => order.count),
        backgroundColor: orderData.map((order) => statusColors[order.status]),
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
      <div className="flex flex-row items-center justify-center space-x-2 h-full">
        <div className="h-auto">
          <Pie data={data} />
        </div>
        <div className="h-auto">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default OrderDistributionChart;
