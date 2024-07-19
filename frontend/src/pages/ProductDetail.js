import { React, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import CategoryLists from "../components/CategoryLists";
import ProductLists from "../components/ProductList";

const ProductDetail = () => {
  const { id } = useParams();

  const { products, onAddToCart, onSetWishlist } = useContext(ProductContext);

  const product = products.find((product) => (product.id = id));

  return (
    <div className="grid grid-cols-7 gap-4 mt-4 border border-gray-200 p-6 px-20 mx-4 ">
      <div className="col-span-5">
        <div className=" flex flex-row gap-2 ">
          <div className=" shadow-lg border-gray-300 rounded w-2/5">
            <div className="shadow-md rounded-md py-2 my-2">
              <img
                src={product.image}
                className="w-auto h-60"
                alt="product.title"
              />
            </div>
            <div className="flex flex-row justify-between px-2 my-2 mx-2 rounded shadow-sm ">
              <img src={product.image} className="h-24 " alt="product.title" />
              <img src={product.image} className=" h-24" alt="product.title" />
              <img src={product.image} className=" h-24" alt="product.title" />
            </div>
          </div>

          <div className="w-3/5 shadow-md  rounded-md ">
            <div className="py-2 px-4">
              <p className="text-lg font-semibold">-20% off</p>
              <h1 className="font-semibold text-3xl">
                {product.category.title}
              </h1>
              <p className="text-[#bb7cc0e9] text-sm">
                ⭐⭐⭐(3) {product.rating} (286) Reviewed
              </p>

              <p className="text-[#4d2d96] text-lg my-1">{product.title}</p>
              <p className="text-[#4d2d96] text-lg">{product.specifications}</p>
              <p className="text-[#313432] text-lg py-2">by Samsung</p>
              <div className="h-auto">
                <div className=" font-bold ">
                  <p className="inline text-3xl text-green-600 font-semibold mr-2 ">
                    ${product.price}
                  </p>
                  <p className="text-2xl text-slate-400   px-2 inline-block">
                    <p className="text-sm">-20% off</p>
                    <span className="line-through font-semibold">
                      ${product.old_price}
                    </span>
                  </p>
                  <div className=" w-24 py-2 px-2 ">
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      className="w-20 py-2 px-2 border outline-none border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex flex-row gap-2 py-2 px-auto mx-auto">
                    <p
                      className=" bg-green-500  text-white  shadow-sm rounded px-2 py-1  hover:cursor-pointer "
                      onClick={(e) => onAddToCart(product)}
                    >
                      🛒 Add to cart
                    </p>

                    <p
                      className=" text-white border rounded-md px-2 py-1 hover:cursor-pointer"
                      onClick={(e) => onSetWishlist(product)}
                    >
                      ❤️
                    </p>
                  </div>
                  <div className=" text-sm text-slate-400 mt-4">
                    <div className="flex flex-row gap-10">
                      <div className="py-2">
                        <p>Type: Organic</p>
                        <p>SKU: Organic</p>
                        <p>MFG: Organic</p>
                      </div>
                      <div className="py-2">
                        <p>Life: 100day </p>
                        <p>Stock: </p>
                        <p>Tags: 12eht</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row text-lg  text-slate-500 font-semibold font-sans border border-gray-200 py-4 px-2 mt-4 mx-2 items-center justify-between rounded shadow-md">
          <p className="border px-2 py-1 rounded-full hover:text-green-500 hover:text-xl hover:px-3">
            Description
          </p>
          <p className="border px-4 py-1 rounded-full hover:text-green-500 hover:text-xl hover:px-5">
            Additional info
          </p>
          <p className="border px-4 py-1 rounded-full hover:text-green-500 hover:text-xl hover:px-5">
            Vendor
          </p>
          <p className="border px-4 py-1 rounded-full hover:text-green-500 hover:text-xl hover:px-5">
            Reviews(50)
          </p>
        </div>

        <div className="px-3 mx-2 mt-4 py-2 w-full rounded-md shadow-md">
          <h1 className="text-2xl py-2 border-b  px-2 ">Related Products</h1>
          <ProductLists products={products} />
        </div>
      </div>

      <div className="col-span-2 px-4  shadow-lg  h-auto">
        {/* delivery */}
        <div className="py-2 my-2 px-3 bg-gray-100 h-auto rounded-md shadow-md">
          <h1 className="text-black font-semibold px-2 py-2 text-2xl">
            Delivery
          </h1>
          <p className="text-md font-semibold ">➕ location</p>
          <p className="my-4 py-2 flex flex-row gap-10 items-center px-2 font-semibold">
            <p className="text-sm text-red-500 py-1">unverified address</p>
            <p className="text-blue-500 hover:cursor-pointer">change</p>
          </p>
          <hr />
          <h2 className="font-semibold text-xl px-2">Return & Warrenty</h2>
          <p className="flex flex-col gap-2 text-lg px-2 font-semibold text-slate-400">
            <small>100% Authentic</small>
            <small>100 Days Return</small>
            <small>100 Months Warrenty</small>
          </p>
        </div>

        {/* vendor component */}

        <div className="py-2 my-4 px-3 bg-gray-100 h-auto rounded-md shadow-md">
          <h1 className="text-black font-semibold px-2 py-2 text-2xl">
            Vendor
          </h1>
          <div>
            <img
              src={product.image}
              className="w-24 h-24 rounded-full inline"
              alt="vendor-img"
            />
            <span className="px-4 mx-4 text-md font-semibold">Samsung PLC</span>
            <p>⭐⭐⭐(3) 589 Reviews</p>
          </div>

          <hr />
          <h2 className="font-semibold text-xl px-2">Info</h2>
          <p className="flex flex-col gap-2 text-lg px-2 font-semibold text-slate-400">
            <small>Address: Ethiopia,Bahirdar</small>
            <small>Contact seller: +2519539503</small>
          </p>
          <hr />
          <p className="flex flex-row justify-between px-2 text-lg font-semibold">
            <p className="py-2 my-2">
              <p> Rating</p>
              <p className="text-xl">100%</p>
            </p>
            <p className="py-2 my-2">
              <p> Ship on time</p>
              <p className="text-xl">100%</p>
            </p>
            <p className="py-2 my-2">
              <p> Chat response</p>
              <p className="text-xl">100%</p>
            </p>
          </p>
          <hr />
          <h2 className="py-2">
            Become vendor?
            <span className="text-green-500 px-2 py-1 text-lg hover:cursor-pointer">
              Register now
            </span>
          </h2>
        </div>
        {/* category */}
        <CategoryLists />
      </div>
    </div>
  );
};

export default ProductDetail;
