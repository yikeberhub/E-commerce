import { React, useState, useEffect } from "react";
import Spinner from "../../common/Spinner";
import OrderDistributionChart from "./AdminComponent/OrderDistributionChart";
import SalesTrendsChart from "./AdminComponent/SalesTrendsChart";

const OverviewPanel = ({ totalSales, totalOrders, totalProducts }) => {
  const [data, setData] = useState({
    totalSales: "0.00",
    totalOrders: 0,
    totalProducts: 0,
    totalVendors: 0,
    salesTrends: [],
    orderDistribution: [],
    otherMetrics: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for storing errors

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
        console.log("datas:", result.orderDistribution);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const salesTrends = [
    { date: "2024-01-01", amount: 1000 },
    { date: "2024-01-02", amount: 1500 },
    { date: "2024-01-03", amount: 2000 },
  ];
  const orderDistribution = [
    { status: "Pending", count: 30 },
    { status: "Completed", count: 80 },
    { status: "Canceled", count: 10 },
    { status: "Returned", count: 5 },
  ];

  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md p-4 rounded-lg flex items-center hover:shadow-lg transition-shadow duration-300">
          <i className="fa fa-dollar-sign text-green-600 text-3xl mr-3"></i>
          <div>
            <h2 className="font-semibold text-lg">Total Sales</h2>
            <p className="text-2xl font-bold text-green-600">
              ${data.totalSales}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center hover:shadow-lg transition-shadow duration-300">
          <i className="fa fa-shopping-cart text-blue-600 text-3xl mr-3"></i>
          <div>
            <h2 className="font-semibold text-lg">Total Orders</h2>
            <p className="text-2xl font-bold text-blue-600">
              #{data.totalOrders}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center hover:shadow-lg transition-shadow duration-300">
          <i className="fa fa-user-tie text-orange-500 text-3xl mr-3"></i>
          <div>
            <h2 className="font-semibold text-lg">Total Vendors</h2>
            <p className="text-2xl font-bold text-orange-500">
              #{data.totalVendors}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center hover:shadow-lg transition-shadow duration-300">
          <i className="fa fa-users text-purple-600 text-3xl mr-3"></i>
          <div>
            <h2 className="font-semibold text-lg">Total Users</h2>
            <p className="text-2xl font-bold text-purple-600">
              #{data.totalUsers}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center hover:shadow-lg transition-shadow duration-300">
          <i className="fa fa-box text-teal-600 text-3xl mr-3"></i>
          <div>
            <h2 className="font-semibold text-lg">Total Products</h2>
            <p className="text-2xl font-bold text-teal-600">
              #{data.totalProducts}
            </p>
          </div>
        </div>
      </section>
      {/* Sales Trends Chart */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6 max-w-full">
        <h3 className="font-semibold text-lg mb-4">Sales Trends</h3>
        <SalesTrendsChart salesData={data.salesTrends} />
      </div>

      {/* Order Distribution Chart */}
      <div
        className="bg-white shadow-md p-4 rounded-lg mb-6 
   "
      >
        <h3 className="font-semibold text-lg mb-4">Order Distribution</h3>
        <OrderDistributionChart orderData={data.orderDistribution} />
      </div>
    </div>
  );
};

export default OverviewPanel;
