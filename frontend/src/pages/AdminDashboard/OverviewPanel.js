import { useState, useEffect } from "react";
import Spinner from "../../common/Spinner";
import OrderDistributionChart from "./AdminComponent/OrderDistributionChart";
import SalesTrendsChart from "./AdminComponent/SalesTrendsChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faShoppingCart,
  faUserTie,
  faUsers,
  faBox,
} from "@fortawesome/free-solid-svg-icons";

const OverviewPanel = () => {
  const [data, setData] = useState({
    totalSales: "0.00",
    totalOrders: 0,
    totalProducts: 0,
    totalVendors: 0,
    totalUsers: 0,
    salesTrends: [],
    orderDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/admin_api/super-admin-dashboard/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Sales",
            value: `$${data.totalSales}`,
            icon: faDollarSign,
            color: "text-green-600",
          },
          {
            title: "Total Orders",
            value: `#${data.totalOrders}`,
            icon: faShoppingCart,
            color: "text-blue-600",
          },
          {
            title: "Total Products",
            value: `#${data.totalProducts}`,
            icon: faBox,
            color: "text-teal-600",
          },
          {
            title: "Total Vendors",
            value: `#${data.totalVendors}`,
            icon: faUserTie,
            color: "text-orange-500",
          },
          {
            title: "Total Users",
            value: `#${data.totalUsers}`,
            icon: faUsers,
            color: "text-purple-600",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`bg-white shadow-md p-4 rounded-lg flex items-center hover:shadow-lg transition-shadow duration-300 ${item.color}`}
          >
            <FontAwesomeIcon icon={item.icon} className="text-3xl mr-3" />
            <div>
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Sales Trends Chart */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Sales Trends</h3>
        <SalesTrendsChart salesData={data.salesTrends} />
      </div>

      {/* Order Distribution Chart */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Order Distribution</h3>
        <OrderDistributionChart orderData={data.orderDistribution} />
      </div>
    </div>
  );
};

export default OverviewPanel;
