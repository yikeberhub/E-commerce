import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import "./index.css";
import { Outlet } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/cartContext";

function App() {
  return (
    <div className="h-auto">
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Navigation />
            <Outlet />
            <Footer />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
