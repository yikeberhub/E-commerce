import React, { useEffect, useState } from "react";
import { FaStar, FaStore, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumb";
import { useVendor } from "../contexts/VendorContext";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import EmptyState from "../common/EmptyState";
import { Skeleton } from "../common/Skeleton";
import { selectClass, inputClass } from "../common/formStyles";

const Vendors = () => {
  const { vendors = [], loading, error } = useVendor();
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Vendors", path: "/vendors" });
  }, []);

  const filteredVendors = vendors
    .filter((vendor) => {
      const term = searchTerm.toLowerCase();
      return (
        vendor.title?.toLowerCase().includes(term) ||
        vendor.description?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "rating")
        return b.authentic_rating - a.authentic_rating;
      return 0;
    });

  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-card px-4 py-3 mb-4">
        <Breadcrumb />
      </div>

      <div className="bg-white rounded-xl shadow-card p-5 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
        <p className="text-sm text-slate-500 mt-1">
          {vendors.length} vendor{vendors.length === 1 ? "" : "s"} on the
          marketplace
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search vendors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-9`}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={selectClass}
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Authentic Rating</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden"
            >
              <Skeleton className="h-20 w-full rounded-none" />
              <div className="px-4 pb-4 -mt-8">
                <Skeleton className="h-16 w-16 rounded-xl border-4 border-white" />
                <Skeleton className="h-4 w-1/2 mt-3" />
                <Skeleton className="h-3 w-1/3 mt-2" />
                <Skeleton className="h-3 w-2/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVendors.length === 0 ? (
        <EmptyState
          title="No vendors found"
          description="Try a different search term."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVendors.map((vendor) => (
            <Link
              to={`/vendors/${vendor.id}`}
              key={vendor.id}
              className="group flex flex-col bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <div className="h-20 bg-slate-100">
                {vendor.banner_image && (
                  <img
                    src={vendor.banner_image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="px-4 pb-4 -mt-8">
                <img
                  src={vendor.logo}
                  alt={vendor.title}
                  className="h-16 w-16 rounded-xl border-4 border-white shadow-sm object-cover bg-white"
                />
                <h2 className="text-lg font-semibold text-slate-800 group-hover:text-primary-600 transition-colors mt-2">
                  {vendor.title}
                </h2>
                <p className="text-sm text-amber-500 flex items-center gap-1 mt-0.5">
                  <FaStar /> {vendor.authentic_rating}/100
                </p>
                {vendor.address && (
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                    <FaMapMarkerAlt className="text-slate-400 shrink-0" />
                    <span className="truncate">{vendor.address}</span>
                  </p>
                )}
                {vendor.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {vendor.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary-600">
                  <FaStore /> Visit store
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vendors;
