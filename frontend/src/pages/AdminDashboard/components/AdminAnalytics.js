import React, { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  FiTrendingUp,
  FiUsers,
  FiPieChart,
  FiAward,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../../contexts/AuthContext";
import { selectClass } from "../../../common/formStyles";
import { RowSkeleton } from "../../../common/Skeleton";
import EmptyState from "../../../common/EmptyState";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL;

const ROLE_COLORS = {
  admin: "rgba(139, 92, 246, 0.75)",
  vendor: "rgba(37, 134, 172, 0.75)",
  customer: "rgba(16, 185, 129, 0.75)",
};

function AdminAnalytics() {
  const { authTokens } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/analytics/overview/?days=${days}`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!response.ok) throw new Error("Failed to load analytics.");
        setData(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [days]);

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

  const { revenue_trend, user_growth, role_breakdown, category_breakdown, vendor_leaderboard } = data;

  const revenueChartData = {
    labels: revenue_trend.map((r) => new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })),
    datasets: [
      {
        label: "Revenue (ETB)",
        data: revenue_trend.map((r) => r.total),
        borderColor: "rgba(37, 134, 172, 1)",
        backgroundColor: "rgba(37, 134, 172, 0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const userGrowthChartData = {
    labels: user_growth.map((u) => new Date(u.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })),
    datasets: [
      {
        label: "New Users",
        data: user_growth.map((u) => u.count),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const roleChartData = {
    labels: role_breakdown.map((r) => r.role),
    datasets: [
      {
        data: role_breakdown.map((r) => r.count),
        backgroundColor: role_breakdown.map((r) => ROLE_COLORS[r.role] || "rgba(148, 163, 184, 0.75)"),
        borderWidth: 0,
      },
    ],
  };

  const categoryChartData = {
    labels: category_breakdown.map((c) => c.category),
    datasets: [
      {
        label: "Products",
        data: category_breakdown.map((c) => c.count),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiTrendingUp className="text-primary-500" /> Analytics
        </h1>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={selectClass}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FiTrendingUp className="text-primary-500" /> Revenue Trend
          </h2>
          {revenue_trend.length ? (
            <div style={{ height: "240px" }}>
              <Line
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
            <EmptyState title="No revenue yet" description="Revenue over the selected range will appear here." />
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FiUsers className="text-primary-500" /> User Growth
          </h2>
          {user_growth.length ? (
            <div style={{ height: "240px" }}>
              <Line
                data={userGrowthChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                }}
              />
            </div>
          ) : (
            <EmptyState title="No new users" description="New sign-ups over the selected range will appear here." />
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FiPieChart className="text-primary-500" /> Users by Role
          </h2>
          {role_breakdown.length ? (
            <div style={{ height: "220px" }} className="flex items-center justify-center">
              <Doughnut
                data={roleChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "right", labels: { boxWidth: 10, font: { size: 11 } } } },
                }}
              />
            </div>
          ) : (
            <EmptyState title="No users yet" description="User role distribution will appear here." />
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FiPieChart className="text-primary-500" /> Products by Category
          </h2>
          {category_breakdown.length ? (
            <div style={{ height: "220px" }}>
              <Bar
                data={categoryChartData}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
                }}
              />
            </div>
          ) : (
            <EmptyState title="No categories yet" description="Product distribution by category will appear here." />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FiAward className="text-primary-500" /> Vendor Leaderboard
        </h2>
        {vendor_leaderboard.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Vendor</th>
                  <th className="py-2 pr-3 font-medium">Revenue</th>
                  <th className="py-2 pr-3 font-medium">Orders</th>
                </tr>
              </thead>
              <tbody>
                {vendor_leaderboard.map((v, i) => (
                  <tr key={v.id} className="border-b border-slate-50 last:border-b-0">
                    <td className="py-2.5 pr-3 text-slate-400">{i + 1}</td>
                    <td className="py-2.5 pr-3 font-medium text-slate-800">{v.title}</td>
                    <td className="py-2.5 pr-3 text-slate-700">{v.revenue.toLocaleString()} ETB</td>
                    <td className="py-2.5 pr-3 text-slate-600">{v.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No vendor sales yet" description="Top-earning vendors will appear here." />
        )}
      </div>
    </div>
  );
}

export default AdminAnalytics;
