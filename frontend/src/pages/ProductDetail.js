import { React, useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import CategoryLists from "../components/CategoryLists";
import ProductLists from "../components/ProductList";
import AddWishlistIcon from "../assets/icons/images/wishlist_gold.png";
import RemoveWishlistIcon from "../assets/icons/images/wishlist_purple.png";
import AddCartIcon from "../assets/icons/images/cart.png";
import RemoveCartIcon from "../assets/icons/images/cart_black_white.png";
import { useCart } from "../contexts/cartContext";
import SummaryApi from "../common";
import { useWishlist } from "../contexts/WishlistContext";
import ProductReview from "../components/ProductReview";
import VendorComponent from "../components/VendorComponent";

const VendorDetails = ({ vendor }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{vendor.title}</h2>
      <div className="flex justify-around mb-4">
        <div className="vendor-logo">
          <img
            src={vendor.logo}
            className="w-32 h-32 rounded-full border border-gray-200 shadow-md"
            alt={`${vendor.title} logo`}
          />
        </div>
        <p className="text-gray-600 mb-4">{vendor.description}</p>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2">Contact Information</h3>
      <table className="w-full border-collapse mb-4">
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">Address:</td>
            <td className="py-2 text-gray-600">{vendor.address}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">Email:</td>
            <td className="py-2 text-gray-600">{vendor.email}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">Phone Number:</td>
            <td className="py-2 text-gray-600">{vendor.phone_number}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">Website:</td>
            <td className="py-2 text-gray-600">
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {vendor.website}
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mt-4 mb-2">Performance Metrics</h3>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">
              Chat Response Time:
            </td>
            <td className="py-2 text-gray-600">
              {vendor.chat_response_time} seconds
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">
              Shipping On Time:
            </td>
            <td className="py-2 text-gray-600">{vendor.shipping_on_time}%</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">
              Authentic Rating:
            </td>
            <td className="py-2 text-gray-600">
              {vendor.authentic_rating}/100
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">Days Return:</td>
            <td className="py-2 text-gray-600">{vendor.days_return} days</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-700">Warranty Period:</td>
            <td className="py-2 text-gray-600">
              {vendor.warranty_period} months
            </td>
          </tr>
        </tbody>
      </table>
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
    const x = e.clientX - bounds.left; // Get x position of mouse
    const y = e.clientY - bounds.top; // Get y position of mouse

    // Calculate the position and size of the zoom lens
    const lensSize = 100; // Size of the zoom lens
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
      backgroundImage: `url(${currentImage})`, // Use currentImage for zoom
      backgroundSize: `${bounds.width * 2}px ${bounds.height * 2}px`,
      backgroundPosition: `-${left * 2}px -${top * 2}px`,
    });
  };

  const handleThumbnailClick = (image) => {
    setCurrentImage(image); // Update the current image to zoom
  };

  return (
    <div className="relative shadow-md rounded-md w-full md:w-2/5">
      <img
        ref={zoomRef}
        src={currentImage} // Use the current image for the zoom effect
        className="w-full sm:h-60 h-full object-cover rounded-md"
        alt={product?.title}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />
      {isZooming && (
        <div
          className="absolute rounded-full border border-white opacity-75"
          style={{
            width: "100px",
            height: "100px",
            pointerEvents: "none",
            ...zoomStyle,
          }}
        />
      )}
      <div className="flex flex-row justify-between px-2 my-2">
        {product.images?.map((image) => (
          <img
            key={image?.id}
            src={image?.image}
            className="h-24 object-cover rounded-md mx-1 cursor-pointer" // Add cursor-pointer
            alt="product_img"
            onClick={() => handleThumbnailClick(image.image)} // Update current image on click
          />
        ))}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading, setLoading } = useContext(ProductContext);
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

  console.log(("produt is", product));

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
        return <p>{product?.description}</p>;
      case "Vendor":
        return !product.vendor ? (
          <p>Vendor information displayed here.</p>
        ) : (
          <VendorDetails vendor={product.vendor} />
        );

      case "Additional info":
        return (
          <div>
            <p>Additional information about the product</p>
          </div>
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

  if (loading || !product) return <div>Loading...</div>;
  console.log("product detail is", product);

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4  p-4 min-h-screen">
      <div className="col-span-1 md:col-span-4  shadow-lg rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <ProductImageZoom product={product} />

          <div className="w-full  md:w-3/5">
            <div className="py-2 px-4">
              {product.discount_percentage !== 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-sm shadow-md">
                  {`${product.discount_percentage.toFixed(1)}% off!`}
                </span>
              )}
              <h1 className="font-semi-bold text-xl">
                {product?.category?.title}
              </h1>
              <p className="text-blue-500 text-sm">
                ⭐⭐⭐ {product?.average_rating} ({product.number_of_reviews})
                Reviewed
              </p>
              <p className="text-gray-600 text-lg my-1">{product?.title}</p>
              <p className="text-gray_lighter text-lg">
                {truncateDescription(product?.description, 50)}
              </p>
              <p className="text-gray-600 text-lg py-1">
                By{" "}
                <span className="text-blue-600 font-bold text-lg">
                  {" "}
                  {product.vendor.title}
                </span>
              </p>

              <div className="font-bold">
                <p className="inline text-3xl text-green-600 mr-2">
                  ${product?.price}
                </p>
                <span className="text-2xl text-slate-400 line-through font-semibold">
                  ${product?.old_price}
                </span>
                <div className="flex flex-row gap-2 py-2">
                  <button
                    className="bg-blue-600 text-white rounded-md px-4 py-1 hover:bg-blue-700 transition"
                    onClick={handleAddToCart}
                  >
                    <img
                      src={!addedToCart ? AddCartIcon : RemoveCartIcon}
                      className="w-5 h-5 inline-block"
                      alt="cart_icon"
                    />
                    {!addedToCart ? "Add to Cart" : "Remove from Cart"}
                  </button>

                  <button
                    className="bg-purple-600 text-white rounded-md px-4 py-1 hover:bg-purple-700 transition"
                    onClick={handleAddToWishlist}
                  >
                    <img
                      src={
                        !addedToWishlist ? AddWishlistIcon : RemoveWishlistIcon
                      }
                      className="w-5 h-5 inline-block"
                      alt="wishlist_icon"
                    />
                    {!addedToWishlist
                      ? "Add to Wishlist"
                      : "Remove from Wishlist"}
                  </button>
                </div>
                <div className="text-sm text-slate-400 mt-4">
                  <div className="flex flex-col md:flex-row gap-10">
                    <div>
                      <p>Category: {product.category?.title}</p>
                      <p>SKU: Organic</p>
                      <p>MFG: Organic</p>
                    </div>
                    <div>
                      <p>Life: 100 days</p>
                      <p>Stock: {product.stock_quantity}</p>
                      <div className="bg-gray-50 flex flex-row items-center">
                        <span className="inline">Tags</span>
                        <p className="flex px-2">
                          {product?.tags?.map((tag) => (
                            <span className="px-1 py-1 text-sm rounded-md text-green-500">
                              {tag.name}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row text-md text-black font-semibold border-t border-gray py-4 mt-4">
          {["Description", "Additional info", "Vendor", "Reviews"].map(
            (tab) => (
              <p
                key={tab}
                className={`mx-2 cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-500 border-b"
                    : "hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </p>
            )
          )}
        </div>

        <div className="px-3 mt-4 py-2 w-full rounded-md shadow-md">
          {renderTabContent()}
        </div>

        <div className="px-3 mt-4 py-2 w-full rounded-md shadow-md">
          <h1 className="text-2xl py-2 mb-3 border-b border-gray">
            Related Products
          </h1>
          <ProductLists products={products} category={"mobile"} />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 bg-gray-200 shadow-lg rounded-lg p-4 h-fit">
        <div className="py-2 my-2 px-3 bg-gray-50 rounded-md shadow-md">
          <h1 className="text-white font-semibold text-xl">Delivery</h1>
          <p className="text-md font-semibold">➕ Location</p>
          <div className="my-4 flex justify-between items-center">
            <p className="text-sm text-red-500">Unverified address</p>
            <p className="text-red cursor-pointer">Change</p>
          </div>
          <hr className="text-gray" />
          <h2 className="font-semibold text-lg">Return & Warranty</h2>
          <p className="flex flex-col gap-2 text-lg font-semibold text-slate-400">
            <small>100% Authentic</small>
            <small>100 Days Return</small>
            <small>100 Months Warranty</small>
          </p>
        </div>

        <div className="py-2 my-4 px-3 bg-gary-50 rounded-md shadow-md">
          <VendorComponent vendor={product.vendor} />
        </div>
        <CategoryLists />
      </div>
    </div>
  );
};

export default ProductDetail;
