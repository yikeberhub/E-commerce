import Header from "./components/Header";
import ProductLists from "./pages/ProductList";
import Footer from "./components/Footer";
import CatagoryLists from "./components/CatagorieLists";
import "./index.css";
import { useState } from "react";

import Mobile from "./assets/products/mobile/SAMSUNG Galaxy A03 (Black, 32 GB) (3 GB RAM) 3.webp";
import Earphone from "./assets/products/earphones/boAt Rockerz 103 Pro 3.webp";
import Mobile2 from "./assets/products/mobile/realme Narzo 50 (Speed Blue, 64 GB) (4 GB RAM) 4.webp";
import Camera from "./assets/products/camera/DIGITEK® (DTR 260 GT) Gorilla Tripod-Mini 33 CM (13 Inch) Tripod for Mobile Phone with Phone Mount & Remote, Flexible Gorilla Stand for DSLR & Action Cameras 2.jpg";
import CartLists from "./components/CartLists";
import Wishlists from "./components/Wishlists";
import PageRoutes from "./Routes/PageRoutes";

const initialProducts = [
  {
    id: 1,
    category: "Mobile",
    name: "Samsung galaxy S10 pro",
    rating: "⭐⭐⭐⭐",
    image: Mobile,
    quantity: 20,
    production_date: "2024-06-28",
    expire_date: "2024-11-22",
    description: "2019 model 50px camera 128gb storage",
    actual_price: 33000,
    discount: "20%",
    discounted_price: 30000.0,
    Catagory: "mobile",
  },
  {
    id: 2,
    category: "Earphone",
    name: "Xles earphone",
    rating: "⭐⭐⭐⭐",
    image: Earphone,
    quantity: 150,
    production_date: "2024-06-19",
    expire_date: "2024-06-12",
    description: "new brand earphone",
    actual_price: 5000,
    discount: "20%",
    discounted_price: 4600.0,
    Catagory: "Earphone",
  },
  {
    id: 3,
    category: "Camera",
    name: "clipx  camera",
    rating: "⭐⭐⭐⭐",
    image: Camera,
    quantity: 10,
    production_date: "2024-06-19",
    expire_date: "2024-06-12",
    description: "new brand canera",
    actual_price: 5000,
    discount: "20%",
    discounted_price: 4600.0,
    Catagory: "camera",
  },
  {
    id: 4,
    category: "Mobile",
    name: "Samsung note 9",
    rating: "⭐⭐⭐⭐",
    image: Mobile,
    quantity: 20,
    production_date: "2024-06-19",
    expire_date: "2024-06-12",
    description: "new brand canera",
    actual_price: 5000,
    discount: "20%",
    discounted_price: 4600.0,
    Catagory: "Mobile",
  },
  {
    id: 5,
    category: "Earphone",
    name: "Earpode ",
    rating: "⭐⭐⭐⭐",
    image: Earphone,
    quantity: 10,
    production_date: "2024-06-19",
    expire_date: "2024-06-12",
    description: "new brand earphone",
    actual_price: 5000,
    discount: "20%",
    discounted_price: 4600.0,
    Catagory: "Earphone",
  },
  {
    id: 6,
    category: "Camera",
    name: "clipx  camera",
    rating: "⭐⭐⭐⭐",
    image: Camera,
    quantity: 10,
    production_date: "2024-06-19",
    expire_date: "2024-06-12",
    description: "new brand camera",
    actual_price: 5000,
    discount: "20%",
    discounted_price: 4600.0,
    Catagory: "camera",
  },
  {
    id: 7,
    category: "Mobile",
    name: "infinix hot pro",
    rating: "⭐⭐⭐⭐",
    image: Mobile,
    quantity: 10,
    production_date: "2024-06-19",
    expire_date: "2024-06-12",
    description: "new brand mobile",
    actual_price: 5000,
    discount: "20%",
    discounted_price: 4600.0,
    Catagory: "camera",
  },
  {
    id: 8,
    category: "Mobile",
    name: "Iphone promax",
    rating: "⭐⭐⭐⭐",
    image: Mobile2,
    quantity: 10,
    production_date: "2024-06-19",
    expire_date: "2024-06-12",
    description: "new brand 2024",
    actual_price: 5000,
    discount: "20%",
    discounted_price: 4600.0,
    Catagory: "camera",
  },
];

function App() {
  const [products, setProduct] = useState(initialProducts);
  const [addToCart, setAddToCart] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [showProductLists, setShowProductLists] = useState(true);
  const [searchedProducts, setSearchedProducts] = useState(products);
  const [showCartLists, setShowCartLists] = useState(false);
  const [showWishlists, setShowWishlists] = useState(false);
  const [showSearchedProducts, setShowSearchedProducts] = useState(false);

  const handleAddToCart = (product) => {
    setAddToCart((curCarts) => [...curCarts, product]);
  };
  const handleFilterProduct = (products) => {
    setSearchedProducts(products);
    setShowCartLists((state) => (state ? !state : state));
    setShowProductLists((state) => (state ? !state : state));
    setShowWishlists((state) => (state ? !state : state));
    setShowSearchedProducts((state) => !state);
  };
  const handleAddToWishlist = (product) => {
    setWishlists((curWishlists) => [...curWishlists, product]);
  };

  const handleShowCartList = () => {
    setShowCartLists((state) => !state);
    setShowProductLists((state) => (state ? !state : state));
    setShowWishlists((state) => (state ? !state : state));
    setShowSearchedProducts((state) => (state ? !state : state));
  };

  const handleShowWishlists = () => {
    console.log("wishlists is clicked");
    setShowCartLists((state) => (state ? !state : state));
    setShowProductLists((state) => (state ? !state : state));
    setShowWishlists((state) => !state);
    setShowSearchedProducts((state) => (state ? !state : state));
  };
  const handleSetProduct = (products) => setProduct(products);
  // console.log(Wishlists);

  return (
    <div className="">
      <Header
        addToCart={addToCart}
        products={products}
        onFilterProducts={handleFilterProduct}
        wishlists={wishlists}
        onSetShowCartList={handleShowCartList}
        onSetShowWishlist={handleShowWishlists}
      />

      <div className="grid grid-cols-6">
        <CatagoryLists products={products} />
        {showCartLists && <CartLists addedProducts={addToCart} />}
        {showWishlists && <Wishlists addedProducts={wishlists} />}

        {showProductLists && (
          <ProductLists
            products={products}
            onSetProducts={handleSetProduct}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        )}
        {showSearchedProducts && (
          <ProductLists
            products={searchedProducts}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
