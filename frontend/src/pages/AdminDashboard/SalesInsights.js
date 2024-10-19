// SalesInsights.js
import React from "react";

const SalesInsights = () => {
  return (
    <section className="bg-white shadow-md p-4 rounded-lg mb-6">
      <h2 className="font-semibold text-lg">Sales Insights</h2>
      <div className="mt-2">
        <canvas id="salesChart"></canvas>
      </div>
    </section>
  );
};

export default SalesInsights;
