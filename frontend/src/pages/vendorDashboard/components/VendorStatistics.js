import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FiBarChart2,
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiStar,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../../contexts/AuthContext";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_COLORS = {
  pending: "rgba(250, 176, 5, 0.75)",
  payment_processing: "rgba(250, 176, 5, 0.75)",
  payment_failed: "rgba(239, 68, 68, 0.75)",
  processing: "rgba(139, 92, 246, 0.75)",
  shipped: "rgba(37, 134, 172, 0.75)",
  delivered: "rgba(16, 185, 129, 0.75)",
  completed: "rgba(16, 185, 129, 0.75)",
  canceled: "rgba(148, 163, 184, 0.75)",
  returned: "rgba(148, 163, 184, 0.75)",
  refunded: "rgba(148, 163, 184, 0.75)",
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
    <div className="flex items-center gap-2 text-slate-400 text-xs">
      <Icon /> {label}
    </div>
    <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

function VendorStatistics() {
  const { authTokens } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/vendors/analytics/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load statistics.");
        setStats(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <RowSkeleton count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  const { summary, revenue_trend, status_breakdown, top_products } = stats;
  const hasRevenue = revenue_trend.length > 0;
  const hasStatuses = status_breakdown.length > 0;
  const hasTopProducts = top_products.length > 0;

  const revenueChartData = {
    labels: revenue_trend.map((r) => r.month),
    datasets: [
      {
        label: "Revenue",
        data: revenue_trend.map((r) => r.total),
        backgroundColor: "rgba(37, 134, 172, 0.7)",
        borderColor: "rgba(37, 134, 172, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const statusChartData = {
    labels: status_breakdown.map((s) => s.status.replace(/_/g, " ")),
    datasets: [
      {
        data: status_breakdown.map((s) => s.count),
        backgroundColor: status_breakdown.map(
          (s) => STATUS_COLORS[s.status] || "rgba(148, 163, 184, 0.75)"
        ),
        borderWidth: 0,
      },
    ],
  };

  const topProductsChartData = {
    labels: top_products.map((p) => p.title),
    datasets: [
      {
        label: "Units Sold",
        data: top_products.map((p) => p.units_sold),
        backgroundColor: "rgba(37, 134, 172, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={`${summary.total_revenue.toLocaleString()} ETB`}
        />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={summary.total_orders} />
        <StatCard icon={FiBox} label="Total Products" value={summary.total_products} />
        <StatCard
          icon={FiStar}
          label="Avg Rating"
          value={summary.average_rating != null ? summary.average_rating : "—"}
        />
        <StatCard
          icon={FiDollarSign}
          label="Balance"
          value={summary.balance != null ? `${summary.balance.toLocaleString()} ETB` : "—"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FiBarChart2 className="text-primary-500" /> Revenue Trend
          </h2>
          {hasRevenue ? (
            <div style={{ height: "260px" }}>
              <Bar
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          ) : (
            <EmptyState title="No revenue yet" description="Revenue will appear here once orders come in." />
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FiShoppingBag className="text-primary-500" /> Orders by Status
          </h2>
          {hasStatuses ? (
            <div style={{ height: "260px" }} className="flex items-center justify-center">
              <Doughnut
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "right", labels: { boxWidth: 10, font: { size: 11 } } } },
                }}
              />
            </div>
          ) : (
            <EmptyState title="No orders yet" description="Order status breakdown will appear here." />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FiBox className="text-primary-500" /> Top Products
        </h2>
        {hasTopProducts ? (
          <div style={{ height: "260px" }}>
            <Bar
              data={topProductsChartData}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true } },
              }}
            />
          </div>
        ) : (
          <EmptyState title="No sales yet" description="Your best-selling products will appear here." />
        )}
      </div>
    </div>
  );
}

export default VendorStatistics;
