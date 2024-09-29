import { React, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import ProceedCheckout from "../components/ProceedCheckout";
import { ProductContext } from "../contexts/ProductContext";
import { useCart } from "../contexts/cartContext";

const CartLists = () => {
  const { cart, loading, error, fetchCart, clearCart } = useCart();
  const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
  const [shipingPrice, setShipingPrice] = useState(0);

  useEffect(() => {
    calculateItemPrice();
  }, [fetchCart]);

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = itemsTotalPrice + shipingPrice;

  const calculateItemPrice = () => {
    const itemsTotalPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
    setItemsTotalPrice(itemsTotalPrice);
  };

  console.log("total price is", itemsTotalPrice);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error:{error}</div>;

  return (
    <div className="col-span-5 grid grid-cols-6 border border-gray-200 shadow-sm  pb-10">
      <div className="col-span-4 px-2">
        <h1 className="text-3xl mx-2 py-2">Your Cart</h1>
        <p>
          You have{" "}
          {cart.items.length
            ? `${cart.items.length} Item in the cart`
            : "no Item in the cart"}{" "}
          .
        </p>
        <div className="bg-gray-50 h-64 rounded-lg shadow-md">
          <table className="border border-separate border-spacing-2   border-gray-200 w-full  table-auto md:table-fixed">
            <thead>
              <tr className="bg-gray-200 w-full">
                <th>product</th>
                <th>Title</th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Refresh</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <div>your cart is empty</div>
              ) : (
                cart.items.map((cartItem) => (
                  <CartItem
                    cartItem={cartItem}
                    calculateItemPrice={calculateItemPrice}
                    key={cartItem.product.id}
                  />
                ))
              )}
            </tbody>
          </table>
          <div className="flex flex-row items-center justify-between px-2 py-2">
            <Link to={`/`}>
              <button className="bg-green-500 mt-2 py-1 px-2 rounded text-white">
                Continue shoping
              </button>
            </Link>
            {cart.items.length ? (
              <button
                className="bg-green-500 mt-1  py-2 px-2 rounded text-white"
                onClick={(e) => clearCart()}
              >
                clear cart
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2  mb-2 shadow-md">
        <ProceedCheckout
          itemsTotalPrice={itemsTotalPrice}
          totalPrice={totalPrice}
          shipingPrice={shipingPrice}
        />
      </div>
    </div>
  );
};

export default CartLists;
