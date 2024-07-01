import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ProductDetail from "../pages/ProductDetail";
import ProductCategory from "../pages/ProductCategory";
import Checkout from "../pages/Checkout";
import SearchProduct from "../pages/SearchProduct";
import Cart from "../pages/Cart";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import PageNotFound from "../pages/PageNotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<Home />} index />
      <Route path="login/" element={<Login />} />
      <Route path="signup/" element={SignUp} />
      <Route path="forgot-password/" element={<ForgotPassword />} />
      <Route path="product-category/" element={<ProductCategory />} />
      <Route path="cart/" element={<Cart />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="checkout/:id/checkout" element={<Checkout />} />
      <Route
        path="search-product/"
        loader={async ({ request }) => {
          let url = new URL(request.url);
          let searchTerm = url.searchParams.get("ld");
          return searchTerm;
        }}
        element={<SearchProduct />}
      />
      <Route path="product/:id/checkout/" element={<Checkout />} />
      <Route path="about/" element={<About />} />
      <Route path="contact-us/" element={<ContactUs />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

export default router;
