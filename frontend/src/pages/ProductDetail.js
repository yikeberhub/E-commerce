import { React, useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import CategoryLists from "../components/CategoryLists";
import ProductLists from "../components/ProductList";
import { FiShoppingBag, FiCheck, FiHeart, FiMapPin } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { useCart } from "../contexts/cartContext";
import { useAuth } from "../contexts/AuthContext";
import SummaryApi from "../common";
import { useWishlist } from "../contexts/WishlistContext";
import ProductReview from "../components/ProductReview";
import VendorComponent from "../components/VendorComponent";
import { ProductDetailSkeleton } from "../common/Skeleton";

const StarRating = ({ rating = 0, count = 0 }) => (
  <div className="flex items-center gap-1 mt-1">
    <div className="flex text-amber-400 text-xs gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < Math.round(rating) ? "text-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
    <span className="text-xs text-slate-400">({count} Reviewed)</span>
  </div>
);

const VendorDetails = ({ vendor }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        {vendor.title}
      </h2>
      <div className="flex flex-col sm:flex-row gap-6 items-start mb-4">
        <img
          src={vendor.logo}
          className="w-24 h-24 rounded-full border border-slate-100 shadow-sm object-cover shrink-0"
          alt={`${vendor.title} logo`}
        />
        <p className="text-slate-600 text-sm">{vendor.description}</p>
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mt-6 mb-2">
        Contact Information
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
        <div className="flex justify-between sm:justify-start sm:gap-2 border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Address</dt>
          <dd className="text-slate-700 font-medium">{vendor.address}</dd>
        </div>
        <div className="flex justify-between sm:justify-start sm:gap-2 border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Email</dt>
          <dd className="text-slate-700 font-medium">{vendor.email}</dd>
        </div>
        <div className="flex justify-between sm:justify-start sm:gap-2 border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Phone</dt>
          <dd className="text-slate-700 font-medium">
            {vendor.phone_number}
          </dd>
        </div>
        <div className="flex justify-between sm:justify-start sm:gap-2 border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Website</dt>
          <dd>
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline font-medium"
            >
              {vendor.website}
            </a>
          </dd>
        </div>
      </dl>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mt-6 mb-2">
        Performance Metrics
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
        <div className="flex justify-between border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Chat Response Time</dt>
          <dd className="text-slate-700 font-medium">
            {vendor.chat_response_time}s
          </dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Shipping On Time</dt>
          <dd className="text-slate-700 font-medium">
            {vendor.shipping_on_time}%
          </dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Authentic Rating</dt>
          <dd className="text-slate-700 font-medium">
            {vendor.authentic_rating}/100
          </dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Days Return</dt>
          <dd className="text-slate-700 font-medium">
            {vendor.days_return} days
          </dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1.5">
          <dt className="text-slate-500">Warranty Period</dt>
          <dd className="text-slate-700 font-medium">
            {vendor.warranty_period} months
          </dd>
        </div>
      </dl>
    </div>
  );
};

const ProductImageZoom = ({ product }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [currentImage, setCurrentImage] = useState(product?.image);
  const zoomRef = useRef(null);

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const handleMouseMove = (e) => {
    const image = zoomRef.current;
    const bounds = image.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const lensSize = 100;
    const left = Math.max(
      0,
      Math.min(x - lensSize / 2, bounds.width - lensSize)
    );
    const top = Math.max(
      0,
      Math.min(y - lensSize / 2, bounds.height - lensSize)
    );

    setZoomStyle({
      left: `${left}px`,
      top: `${top}px`,
      backgroundImage: `url(${currentImage})`,
      backgroundSize: `${bounds.width * 2}px ${bounds.height * 2}px`,
      backgroundPosition: `-${left * 2}px -${top * 2}px`,
    });
  };

  const handleThumbnailClick = (image) => {
    setCurrentImage(image);
  };

  return (
    <div className="w-full md:w-2/5 shrink-0">
      <div className="relative rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
        <img
          ref={zoomRef}
          src={currentImage}
          className="w-full sm:h-72 h-full object-cover"
          alt={product?.title}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        />
        {isZooming && (
          <div
            className="absolute rounded-full border-2 border-white shadow-lg opacity-90"
            style={{
              width: "100px",
              height: "100px",
              pointerEvents: "none",
              ...zoomStyle,
            }}
          />
        )}
      </div>
      {product.images?.length > 0 && (
        <div className="flex flex-row gap-2 mt-2">
          {product.images?.map((image) => (
            <img
              key={image?.id}
              src={image?.image}
              className={`h-16 w-16 object-cover rounded-lg cursor-pointer border-2 transition ${
                currentImage === image?.image
                  ? "border-primary-500"
                  : "border-transparent hover:border-slate-200"
              }`}
              alt="product_img"
              onClick={() => handleThumbnailClick(image.image)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading, setLoading } = useContext(ProductContext);
  const { user } = useAuth();
  const [product, setProduct] = useState(null);

  const { newItem, addCartItem, removeCartItem, checkItemInCart } = useCart();
  const {
    newWishlistItem,
    addWishlistItem,
    removeWishlistItem,
    checkItemInWishlist,
  } = useWishlist();
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    getProductDetail();
  }, [id]);

  let addedToCart, addedToWishlist;
  if (product) {
    addedToCart = checkItemInCart(product.id)["isAdded"];
    addedToWishlist = checkItemInWishlist(product.id)["isAdded"];
  }

  const handleAddToCart = () => {
    const checkedResult = checkItemInCart(product.id);
    if (!checkedResult["isAdded"]) {
      addCartItem(product.id, newItem.quantity);
    } else {
      removeCartItem(checkedResult["item"].id);
    }
  };

  const handleAddToWishlist = () => {
    const checkedResult = checkItemInWishlist(product.id);
    if (!checkedResult["isAdded"]) {
      addWishlistItem(product.id, newWishlistItem.quantity);
    } else {
      removeWishlistItem(checkedResult["item"].id);
    }
  };

  const getProductDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.productDetail.url}/${id}`, {
        method: SummaryApi.method,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Description":
        return <p className="text-slate-600 leading-relaxed">{product?.description}</p>;
      case "Vendor":
        return !product.vendor ? (
          <p className="text-slate-500">Vendor information displayed here.</p>
        ) : (
          <VendorDetails vendor={product.vendor} />
        );

      case "Additional info":
        return (
          <p className="text-slate-600">
            Additional information about the product
          </p>
        );
      case "Reviews":
        return <ProductReview />;
      default:
        return null;
    }
  };

  const truncateDescription = (description, maxLength) => {
    if (!description) return "";
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  if (loading || !product) return <ProductDetailSkeleton />;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
      <div className="col-span-1 md:col-span-4 bg-white shadow-card border border-slate-100 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <ProductImageZoom product={product} />

          <div className="w-full md:w-3/5">
            {!!product.discount_percentage && (
              <span className="inline-block bg-red-500 text-white rounded-full px-2 py-1 text-xs font-semibold shadow-sm mb-2">
                {`${product.discount_percentage.toFixed(1)}% off!`}
              </span>
            )}
            <p className="text-xs uppercase tracking-wide text-slate-400 font-medium">
              {product?.category?.title}
            </p>
            <StarRating
              rating={product?.average_rating}
              count={product?.number_of_reviews}
            />
            <h1 className="text-xl font-semibold text-slate-800 my-1">
              {product?.title}
            </h1>
            <p className="text-slate-500 text-sm">
              {truncateDescription(product?.description, 120)}
            </p>
            <p className="text-slate-600 text-sm py-2">
              By{" "}
              <span className="text-primary-600 font-semibold">
                {product?.vendor?.title}
              </span>
            </p>

            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">
                {product?.price} ETB
              </p>
              {product?.old_price > product?.price && (
                <span className="text-lg text-slate-400 line-through">
                  {product?.old_price} ETB
                </span>
              )}
            </div>

            <div className="flex flex-row flex-wrap gap-3 py-4">
              <button
                className={`flex items-center gap-2 text-white rounded-lg px-4 py-2 text-sm font-medium transition shadow-sm ${
                  addedToCart
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-primary-600 hover:bg-primary-700"
                }`}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <FiCheck className="text-base" />
                ) : (
                  <FiShoppingBag className="text-base" />
                )}
                {!addedToCart ? "Add to Cart" : "Added to Cart"}
              </button>

              <button
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium hover:border-primary-300 hover:text-primary-600 transition"
                onClick={handleAddToWishlist}
              >
                {addedToWishlist ? (
                  <FaHeart className="text-rose-500 text-base" />
                ) : (
                  <FiHeart className="text-base" />
                )}
                {!addedToWishlist
                  ? "Add to Wishlist"
                  : "Remove from Wishlist"}
              </button>
            </div>

            <div className="text-sm text-slate-500 border-t border-slate-100 pt-4">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="space-y-1">
                  <p>Category: {product.category?.title}</p>
                  <p>Stock: {product.stock_quantity}</p>
                </div>
                {product?.tags?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {product?.tags?.map((tag) => (
                      <span
                        key={tag.id ?? tag.name}
                        className="px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-600 font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-1 text-sm font-medium border-t border-slate-100 pt-3 mt-4 overflow-x-auto">
          {["Description", "Additional info", "Vendor", "Reviews"].map(
            (tab) => (
              <button
                key={tab}
                className={`px-3 py-2 rounded-lg whitespace-nowrap transition ${
                  activeTab === tab
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-500 hover:text-primary-600 hover:bg-slate-50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="mt-4 py-2">{renderTabContent()}</div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Related Products
          </h2>
          <ProductLists products={products.slice(0, 10)} />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
        <div className="bg-white border border-slate-100 shadow-card rounded-xl p-4">
          <h2 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
            <FiMapPin className="text-primary-500" /> Delivery
          </h2>
          <div className="my-3 flex justify-between items-center gap-2">
            {(() => {
              const defaultAddress =
                user?.addresses?.find((a) => a.is_default) ||
                user?.addresses?.[0];
              return defaultAddress ? (
                <p className="text-sm text-slate-600 truncate">
                  {defaultAddress.city}, {defaultAddress.region}
                </p>
              ) : (
                <p className="text-sm text-red-500">No address on file</p>
              );
            })()}
            <Link
              to="/user-dashboard/address"
              className="text-primary-600 text-sm shrink-0 hover:underline"
            >
              Change
            </Link>
          </div>
          {product.vendor && (
            <>
              <hr className="border-slate-100" />
              <h3 className="font-semibold text-slate-800 mt-3">
                Return &amp; Warranty
              </h3>
              <ul className="text-sm text-slate-500 mt-1 space-y-1">
                <li>✓ {product.vendor.authentic_rating}/100 Authentic Rating</li>
                <li>✓ {product.vendor.days_return} Days Return</li>
                <li>✓ {product.vendor.warranty_period} Months Warranty</li>
              </ul>
            </>
          )}
        </div>

        <div className="bg-white border border-slate-100 shadow-card rounded-xl p-4">
          <VendorComponent vendor={product.vendor} />
        </div>
        <CategoryLists />
      </div>
    </div>
  );
};

export default ProductDetail;
