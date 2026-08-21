import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaComments,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCalendarAlt,
} from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { useBreadcrumb } from "../contexts/BreadCrumbContext";
import Breadcrumb from "../components/BreadCrumb";
import { useVendor } from "../contexts/VendorContext";
import ProductLists from "../components/ProductList";
import EmptyState from "../common/EmptyState";
import {
  DetailHeroSkeleton,
  StatRowSkeleton,
  ProductGridSkeleton,
} from "../common/Skeleton";

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-card px-4 py-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

function VendorDetail() {
  const { vendors, products, loading, loadVendorProducts } = useVendor();
  const { id } = useParams();
  const { addBreadcrumb, clearBreadcrumbs } = useBreadcrumb();
  const [productsLoading, setProductsLoading] = useState(true);

  const vendor = vendors.find((vendor) => vendor.id === Number(id));

  useEffect(() => {
    if (id) {
      setProductsLoading(true);
      loadVendorProducts(id).finally(() => setProductsLoading(false));
    }
  }, [id]);

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb({ label: "Home", path: "/" });
    addBreadcrumb({ label: "Vendors", path: "/vendors" });
    if (vendor) {
      addBreadcrumb({ label: vendor.title });
    }
  }, [id, vendor?.title]);

  if (loading && !vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="mb-6">
          <DetailHeroSkeleton />
        </div>
        <div className="mb-6">
          <StatRowSkeleton />
        </div>
        <ProductGridSkeleton />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Vendor not found"
          description="This vendor may have been removed or the link is incorrect."
          action={
            <Link
              to="/vendors"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Browse all vendors
            </Link>
          }
        />
      </div>
    );
  }

  const memberSince = vendor.created_at
    ? new Date(vendor.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-card px-4 py-3 mb-4">
        <Breadcrumb />
      </div>

      {/* Banner + identity */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden mb-6">
        <div className="h-36 sm:h-48 w-full bg-slate-100">
          {vendor.banner_image && (
            <img
              src={vendor.banner_image}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <img
              src={vendor.logo}
              alt={vendor.title}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover bg-white shrink-0"
            />
            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
              <h1 className="text-2xl font-bold text-slate-900">
                {vendor.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <FaStar /> {vendor.authentic_rating}/100 authentic rating
                </span>
                {memberSince && (
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-slate-400" /> Member since{" "}
                    {memberSince}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-slate-400" /> {vendor.address}
                </span>
              </div>
            </div>
          </div>

          {vendor.description && (
            <p className="text-slate-600 text-sm mt-5 max-w-3xl">
              {vendor.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {vendor.phone_number && (
              <a
                href={`tel:${vendor.phone_number}`}
                className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 transition"
              >
                <FaPhoneAlt className="text-primary-500" /> {vendor.phone_number}
              </a>
            )}
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}`}
                className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 transition"
              >
                <FaEnvelope className="text-primary-500" /> {vendor.email}
              </a>
            )}
            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 transition"
              >
                <FaGlobe className="text-primary-500" /> {vendor.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <StatCard
          icon={<FaComments />}
          label="Chat Response"
          value={`${vendor.chat_response_time}s`}
        />
        <StatCard
          icon={<FaTruck />}
          label="Ships On Time"
          value={`${vendor.shipping_on_time}%`}
        />
        <StatCard
          icon={<FaStar />}
          label="Authentic Rating"
          value={`${vendor.authentic_rating}/100`}
        />
        <StatCard
          icon={<FaUndo />}
          label="Return Window"
          value={`${vendor.days_return} days`}
        />
        <StatCard
          icon={<FaShieldAlt />}
          label="Warranty"
          value={`${vendor.warranty_period} mo`}
        />
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Products from {vendor.title}
          </h2>
          <span className="text-sm text-slate-500">
            {products?.length || 0} product{products?.length === 1 ? "" : "s"}
          </span>
        </div>

        {productsLoading ? (
          <ProductGridSkeleton count={5} />
        ) : products?.length ? (
          <ProductLists products={products} />
        ) : (
          <EmptyState
            title="No products yet"
            description="This vendor hasn't listed any products yet — check back soon."
          />
        )}
      </div>
    </div>
  );
}

export default VendorDetail;
