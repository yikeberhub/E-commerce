import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ProductDetail from "../pages/ProductDetail";
import Products from "../pages/Products";
import ProductCategory from "../pages/ProductCategory";
import Checkout from "../pages/Checkout";
import SearchProduct from "../pages/SearchProduct";
import Cart from "../pages/Cart";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import PageNotFound from "../pages/PageNotFound";
import Wishlist from "../pages/Wishlist";
import UserDashboard from "../pages/dashbord/userDashboard/UserDashboard";
import OrderDetail from "../pages/dashbord/userDashboard/order/OrderDetail";
import UserProfile from "../pages/dashbord/userDashboard/UserProfile";
import Address from "../pages/dashbord/userDashboard/address/Address";
import AccountDetail from "../pages/dashbord/userDashboard/AccountDetail";
import Orders from "../pages/dashbord/userDashboard/order/Orders";
import PaymentConfirmation from "../pages/dashbord/userDashboard/order/PaymentConfirmation";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<Home />} index />
      <Route path="login/" element={<Login />} />
      <Route path="signup/" element={<SignUp />} />
      <Route path="forgot-password/" element={<ForgotPassword />} />
      <Route path="product-category/" element={<ProductCategory />} />
      <Route path="cart/" element={<Cart />} />
      <Route
        path="cart/:id/checkout/"
        loader={async ({ request }) => {
          let url = new URL(request.url);
          let searchTerm = url.searchParams.get("id");
          return searchTerm;
        }}
        element={<Checkout />}
      />

      <Route path="/dashboard/" element={<UserDashboard />}>
        <Route index element={<UserProfile />} />
        <Route path="profile/" element={<UserProfile />} />
        <Route path="orders/" element={<Orders />} />
        <Route path="address/" element={<Address />} />
        <Route path="account-detail/" element={<AccountDetail />} />
        <Route path="orders/:id" element={<OrderDetail />} />
      </Route>
      <Route path="/payment/confirm" element={<PaymentConfirmation />} />
      <Route path="wishlist/" element={<Wishlist />} />
      <Route path="products/" element={<Products />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="checkout/:orderId" element={<Checkout />} />
      <Route
        path="search-product/"
        loader={async ({ request }) => {
          let url = new URL(request.url);
          let searchTerm = url.searchParams.get("ld");
          return searchTerm;
        }}
        element={<SearchProduct />}
      />
      <Route path="about/" element={<About />} />
      <Route path="contact-us/" element={<ContactUs />} />

      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

export default router;
