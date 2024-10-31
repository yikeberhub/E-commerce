import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderChart = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/orders/status-chart/?user_id=${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSales = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/orders/sales-chart/?user_id=${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSales(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchOrders();
    fetchSales();
  }, [user.id, token]);

  const statusColors = {
    pending: "rgba(255, 206, 86, 0.6)", // Yellow
    completed: "rgba(75, 192, 192, 0.6)", // Teal
    payment_failed: "rgba(255, 99, 132, 0.6)", // Red
    processing: "rgba(153, 102, 255, 0.6)", // Purple
  };

  // Prepare data for the order status chart
  const orderChartData = {
    labels: orders.map((order) => order.month), // Month labels
    datasets: Object.keys(statusColors).map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
      data: orders.map((order) => order[status] || 0),
      backgroundColor: statusColors[status],
      borderColor: statusColors[status].replace(/0.6/, "1"),
      borderWidth: 1,
    })),
  };

  const salesChartData = {
    labels: sales.map((sale) => sale.month),
    datasets: [
      {
        label: "Total Amount spent to buy products",
        data: sales.map((sale) => sale.total_sales || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow height to be specified
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Orders Per Month by Status",
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Show all labels
        },
      },
      y: {
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Sales Per Month",
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="flex flex-row gap-6">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Order Status Chart
        </h2>
        <div style={{ height: "300px" }}>
          {" "}
          {/* Set height for the chart */}
          <Bar data={orderChartData} options={options} />
        </div>
      </div>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Sales Chart</h2>
        <div style={{ height: "300px" }}>
          {" "}
          {/* Set height for the chart */}
          <Bar data={salesChartData} options={salesOptions} />
        </div>
      </div>
    </div>
  );
};

export default OrderChart;
