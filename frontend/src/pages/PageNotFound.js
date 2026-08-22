import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

function PageNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mx-auto mb-5">
          <FiAlertTriangle className="text-2xl" />
        </span>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Oops! It looks like the page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
        >
          <FiHome /> Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
