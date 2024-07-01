import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import "./index.css";
import { Outlet } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";

function App() {
  return (
    <div className="h-auto">
      <ProductProvider>
        <Navigation />
        <Outlet />
        <Footer />
      </ProductProvider>
    </div>
  );
}

export default App;
