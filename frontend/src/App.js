import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import "./index.css";
import { Outlet } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { CsrfProvider } from "./contexts/CsrfContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="h-auto">
      <CsrfProvider>
        <ProductProvider>
          <AuthProvider>
            <Navigation />
            <Outlet />
            <Footer />
          </AuthProvider>
        </ProductProvider>
      </CsrfProvider>
    </div>
  );
}

export default App;
