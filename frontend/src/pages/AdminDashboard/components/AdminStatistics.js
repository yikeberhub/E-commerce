import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FiBarChart2,
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiBriefcase,
  FiClock,
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

function AdminStatistics() {
  const { authTokens } = useAuth();
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, analyticsRes] = await Promise.all([
          fetch(`${API_URL}/admin_api/super-admin-dashboard/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }),
          fetch(`${API_URL}/vendors/analytics/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }),
        ]);
        if (!dashRes.ok) throw new Error("Failed to load platform statistics.");
        setStats(await dashRes.json());
        if (analyticsRes.ok) {
          const analytics = await analyticsRes.json();
          setTopProducts(analytics.top_products || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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

  const { totalVendors, pendingVendors, totalUsers, totalProducts, totalOrders, totalSales, salesTrends, orderDistribution } = stats;
  const hasSales = salesTrends.length > 0;
  const hasStatuses = orderDistribution.length > 0;
  const hasTopProducts = topProducts.length > 0;

  const salesChartData = {
    labels: salesTrends.map((s) => new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })),
    datasets: [
      {
        label: "Sales",
        data: salesTrends.map((s) => s.amount),
        backgroundColor: "rgba(37, 134, 172, 0.7)",
        borderColor: "rgba(37, 134, 172, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const statusChartData = {
    labels: orderDistribution.map((s) => s.status.replace(/_/g, " ")),
    datasets: [
      {
        data: orderDistribution.map((s) => s.count),
        backgroundColor: orderDistribution.map(
          (s) => STATUS_COLORS[s.status] || "rgba(148, 163, 184, 0.75)"
        ),
        borderWidth: 0,
      },
    ],
  };

  const topProductsChartData = {
    labels: topProducts.map((p) => p.title),
    datasets: [
      {
        label: "Units Sold",
        data: topProducts.map((p) => p.units_sold),
        backgroundColor: "rgba(37, 134, 172, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={FiDollarSign} label="Total Sales" value={`${Number(totalSales).toLocaleString()} ETB`} />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={totalOrders} />
        <StatCard icon={FiBriefcase} label="Vendors" value={totalVendors} />
        <StatCard icon={FiClock} label="Pending Approval" value={pendingVendors} />
        <StatCard icon={FiUsers} label="Users" value={totalUsers} />
        <StatCard icon={FiBox} label="Products" value={totalProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FiBarChart2 className="text-primary-500" /> Sales Trend
          </h2>
          {hasSales ? (
            <div style={{ height: "260px" }}>
              <Bar
                data={salesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          ) : (
            <EmptyState title="No sales yet" description="Platform-wide sales will appear here once orders come in." />
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
          <FiBox className="text-primary-500" /> Top Selling Products
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
          <EmptyState title="No sales yet" description="The best-selling products platform-wide will appear here." />
        )}
      </div>
    </div>
  );
}

export default AdminStatistics;
