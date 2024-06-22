import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "../App";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";

function PageRoutes() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact Component={App} />
          <Route path="/product/:id" exact Component={ProductDetail} />
          <Route path="/product/:id/checkout" exact Component={Checkout} />
        </Routes>
      </div>
    </Router>
  );
}

export default PageRoutes;
