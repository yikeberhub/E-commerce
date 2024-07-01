import Product from "./Product";
import Mobile from "../assets/products/earphones/boAt Rockerz 518 1.webp";

const ProductLists = ({ products }) => {
  return (
    <div className="col-span-5   items-center justify-center px-2  border border-gray-200 shadow-md ">
      <div className="container-md py-2 my-2 w-full px-auto h-auto">
        <div className=" flex flex-row  bg-gradient-to-r from-yellow-300 to-blue-500 w-full px-10 py-2 h-full shadow-md rounded-md">
          <div>
            <h1 className="text-6xl text-black font-semibold py-2 my-5 px-2 text-wrap ">
              Don't Miss Amazing Electronic Devices
            </h1>
            <p className="text-3xl font-semibold py-2 my-5">
              Sign up for new the daily newsletter
            </p>
            <div className="mb-20 mt-5 mr-20 flex flex-row">
              <input
                type="text"
                placeholder="Your email address..."
                className="py-2 px-2 outline-none border border-green-300 rounded-md mr-2 w-full"
              />
              <input
                type="submit"
                value="subscribe"
                className="bg-green-500 text-xl px-2 py-2 rounded-md hover:cursor-pointer"
              />
            </div>
          </div>
          <div className="mx-2 py-2 rounded-md">
            <img src={Mobile} alt="banner" className="w-auto h-64 " />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mx-2 container-md my-2 py-2">
        <h1 className="text-2xl font-semibold py-2 px-2">Popular Products</h1>
        <ul className="flex flex-row justify-between items-center mx-2 py-2 gap-2">
          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            All
          </li>

          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Computers & Mobiles
          </li>

          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Cameras
          </li>
          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Watches
          </li>
          <li className="text-lg hover:text-xl hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 py-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Earphones
          </li>
        </ul>
      </div>
      <div className="grid sm:grid-cols-8 lg:grid-cols-10 sm:content-start gap-2 w-full py-2">
        {products.map((product, key) => (
          <Product product={product} key={key} />
        ))}
      </div>
    </div>
  );
};

export default ProductLists;
