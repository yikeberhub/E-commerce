import Header from "./header component/Header";

const Navigation = () => {
  return (
    <div>
      <div className="flex flex-row justify-between mx-2 container-md ">
        <ul className="flex flex-row justify-between items-center mx-2 pt-2 pb-1 gap-2">
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 pb-1 pt-2 hover:pb-1 text-slate-500 hover:text-green-400">
            About us |
          </li>
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 pb-1 pt-2 hover:pb-1 text-slate-500 hover:text-green-400">
            My Account |
          </li>
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 pb-1 pt-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Wishlist |
          </li>
        </ul>

        <p className="font-semibold  text-sm pt-2 pb-1">
          Today is 25% of products!
        </p>
        <ul className="flex flex-row justify-between items-center mx-2 pt-2 pb-1 ">
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 pb-1 pt-2 hover:pb-1 text-slate-500 hover:text-green-400">
            Need help? call us |
          </li>
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 pb-1 pt-2 hover:pb-1 text-slate-500 hover:text-green-400">
            +2511946472687 |
          </li>
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 pb-1 pt-2 hover:pb-1 text-slate-500 hover:text-green-400">
            <select>
              <option value="en">English</option>
            </select>
          </li>
          <li className="text-sm hover:text-md hover:cursor-pointer hover:border-b hover:border-b-yellow-400 hover:rounded-b-sm font-semibold px-2 pb-1 pt-2 hover:pb-1 text-slate-500 hover:text-green-400">
            <select>
              <option value="en">ETB</option>
            </select>
          </li>
        </ul>
      </div>
      <hr />
      <Header />
    </div>
  );
};

export default Navigation;
