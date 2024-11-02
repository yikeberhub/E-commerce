import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, Tooltip, Legend);

const OrderDistributionChart = ({ orderData }) => {
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

  const data = {
    labels: orderData.map(
      (order) =>
        order.status.charAt(0).toUpperCase() +
        order.status.slice(1).replace(/_/g, " ")
    ),
    datasets: [
      {
        data: orderData.map((order) => order.count),
        backgroundColor: orderData.map((order) => statusColors[order.status]),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Adjusts chart to fit container
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
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-4 md:space-y-0">
        {/* Pie Chart */}
        <div className="w-full md:w-1/2 aspect-w-1 aspect-h-1">
          <Pie data={data} options={options} />
        </div>

        {/* Bar Chart */}
        <div className="w-full md:w-1/2 aspect-w-1 aspect-h-1">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default OrderDistributionChart;
