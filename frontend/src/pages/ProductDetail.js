import { React, useContext, useEffect, useState } from "react";
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

  if (loading || !product) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-8 gap-6  p-4 min-h-screen">
      <div className="col-span-1 md:col-span-5  shadow-lg rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shadow-md rounded-md w-full md:w-2/5">
            <img
              src={product?.image}
              className=" w-full sm:h-60 h:full  object-cover rounded-md"
              alt={product?.title}
            />
            <div className=" flex flex-row justify-between px-2 my-2">
              {product.images?.map((image) => (
                <img
                  key={image?.id}
                  src={image?.image}
                  className="h-24 object-cover rounded-md mx-1"
                  alt="product_img"
                />
              ))}
            </div>
          </div>

          <div className="w-full  md:w-3/5">
            <div className="py-2 px-4">
              <p className="text-lg font-semibold text-red-500">-20% off</p>
              <h1 className="font-semi-bold text-xl">
                {product?.category?.title}
              </h1>
              <p className="text-blue-500 text-sm">
                ⭐⭐⭐ (3) {product?.rating} (286) Reviewed
              </p>
              <p className="text-gray-600 text-lg my-1">{product?.title}</p>
              <p className="text-gray_lighter text-lg">
                {product?.specifications}
              </p>
              <p className="text-gray_lighter text-lg py-1">by Samsung</p>

              <div className="font-bold">
                <p className="inline text-3xl text-green-600 mr-2">
                  ${product?.price}
                </p>
                <span className="text-2xl text-slate-400 line-through font-semibold">
                  ${product?.old_price}
                </span>
                <div className="w-24 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    min={0}
                    className="w-full py-2 px-2 border border-gray rounded-md"
                  />
                </div>
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
                      <p>Type: Organic</p>
                      <p>SKU: Organic</p>
                      <p>MFG: Organic</p>
                    </div>
                    <div>
                      <p>Life: 100 days</p>
                      <p>Stock: Available</p>
                      <p>Tags: 12eht</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-row text-md  text-black font-semibold border-t border-gray py-4 mt-4">
          <p className="mx-2 cursor-pointer hover:text-blue-500 hover:border-b hover:rounded-md ">
            Description
          </p>
          <p className="mx-2 cursor-pointer hover:text-blue-500 hover:border-b hover:rounded-md ">
            Additional info
          </p>
          <p className="mx-2 cursor-pointer hover:text-blue-500 hover:border-b hover:rounded-md ">
            Vendor
          </p>
          <p className="mx-2 cursor-pointer hover:text-blue-500 hover:border-b hover:rounded-md ">
            Reviews (50)
          </p>
        </div>

        <div className="px-3 mt-4 py-2 w-full rounded-md shadow-md">
          <h1 className="text-2xl py-2 mb-3 border-b border-gray">
            Related Products
          </h1>
          <ProductLists products={products} category={"mobile"} />
        </div>
      </div>

      <div className="col-span-1 md:col-span-3 bg-gray shadow-lg rounded-lg p-4 h-fit">
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
          <h1 className=" font-semibold text-xl">Vendor</h1>
          <div className="flex items-center">
            <img
              src={product?.image}
              className="w-24 h-24 rounded-full"
              alt="vendor-img"
            />
            <span className="px-4 text-md font-semibold">Samsung PLC</span>
            <p>⭐⭐⭐ (3) 589 Reviews</p>
          </div>
          <h2 className="font-semibold text-md">Info</h2>
          <p className="flex flex-col gap-2 text-md font-semibold text-gray_light">
            <small>Address: Ethiopia, Bahirdar</small>
            <small>Contact seller: +2519539503</small>
          </p>
          <hr className="text-gray" />
          <div className="flex justify-between text-lg font-semibold">
            <div>
              <p>Rating</p>
              <p className="text-xl">100%</p>
            </div>
            <div>
              <p>Ship on time</p>
              <p className="text-xl">100%</p>
            </div>
            <div>
              <p>Chat response</p>
              <p className="text-xl">100%</p>
            </div>
          </div>
          <h2 className="py-2">
            Become a vendor?
            <span className="text-green-500 px-2 cursor-pointer">
              Register now
            </span>
          </h2>
        </div>
        <CategoryLists />
      </div>
    </div>
  );
};

export default ProductDetail;
