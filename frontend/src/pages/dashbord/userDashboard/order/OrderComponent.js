import React from "react";

function OrderComponent({ order }) {
  return (
    <div className="p-6">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <img
                  src={item.product.image}
                  alt={item.title}
                  className="w-10 h-10"
                />
              </td>
              <td className="py-2 px-4 border-b">{item.product.title}</td>
              <td className="py-2 px-4 border-b">${item.product.price}</td>
              <td className="py-2 px-4 border-b">{item.quantity}</td>
              <td className="py-2 px-4 border-b">${order.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderComponent;
