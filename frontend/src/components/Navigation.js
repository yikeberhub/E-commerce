import Header from "./header component/Header";

const Navigation = () => {
  return (
    <div className="bg-white shadow-md">
      <div className="flex flex-col md:flex-row justify-between mx-4 container-md">
        <ul className="flex flex-row justify-between items-center pt-2 pb-1 gap-4">
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-slate-500 transition duration-300 hover:text-green-400">
            About us
          </li>
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-slate-500 transition duration-300 hover:text-green-400">
            My Account
          </li>
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-slate-500 transition duration-300 hover:text-green-400">
            Wishlist
          </li>
        </ul>

        <p className="font-semibold text-sm pt-2 pb-1 text-center md:text-left">
          Today is 25% off on all products!
        </p>

        <ul className="flex flex-row justify-between items-center pt-2 pb-1 gap-4">
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 font-semibold text-slate-500 transition duration-300 hover:text-green-400">
            Need help? Call us
          </li>
          <li className="text-sm font-semibold text-slate-500">
            +2511946472687
          </li>
          <li className="text-sm">
            <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
            </select>
          </li>
          <li className="text-sm">
            <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">ETB</option>
            </select>
          </li>
        </ul>
      </div>
      <hr className="border-gray-200" />
      <Header />
    </div>
  );
};

export default Navigation;
