import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { FiBarChart2 } from "react-icons/fi";
import { useAuth } from "../../../../contexts/AuthContext";
import { RowSkeleton } from "../../../../common/Skeleton";
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

const API_URL = process.env.REACT_APP_API_URL;

const statusColors = {
  pending: "rgba(250, 176, 5, 0.7)",
  completed: "rgba(37, 134, 172, 0.7)",
  payment_failed: "rgba(239, 68, 68, 0.7)",
  processing: "rgba(139, 92, 246, 0.7)",
};

const OrderChart = () => {
  const { user, authTokens } = useAuth();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = authTokens?.access;

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${API_URL}/orders/status-chart/?user_id=${user.id}`,
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
          `${API_URL}/orders/sales-chart/?user_id=${user.id}`,
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
  }, [user.id, authTokens?.access]);

  const orderChartData = {
    labels: orders.map((order) => order.month),
    datasets: Object.keys(statusColors).map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
      data: orders.map((order) => order[status] || 0),
      backgroundColor: statusColors[status],
      borderColor: statusColors[status].replace(/0\.7/, "1"),
      borderWidth: 1,
      borderRadius: 4,
    })),
  };

  const salesChartData = {
    labels: sales.map((sale) => sale.month),
    datasets: [
      {
        label: "Total spent",
        data: sales.map((sale) => sale.total_sales || 0),
        backgroundColor: "rgba(37, 134, 172, 0.7)",
        borderColor: "rgba(37, 134, 172, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const baseOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: titleText },
    },
    scales: {
      x: { ticks: { autoSkip: false } },
      y: { beginAtZero: true },
    },
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <RowSkeleton count={4} />
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <RowSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 text-center text-red-500 text-sm">
        Error: {error.message}
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FiBarChart2 className="text-primary-500" /> Order Status
        </h2>
        <div style={{ height: "280px" }}>
          <Bar data={orderChartData} options={baseOptions("Orders per month by status")} />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FiBarChart2 className="text-primary-500" /> Spending
        </h2>
        <div style={{ height: "280px" }}>
          <Bar data={salesChartData} options={baseOptions("Total spent per month")} />
        </div>
      </div>
    </div>
  );
};

export default OrderChart;
