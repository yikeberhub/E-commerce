import React from "react";

const API_URL = process.env.REACT_APP_API_URL;

function OrderComponent({ order }) {
  return (
    <div className="flex flex-col gap-3">
      {order.items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 sm:gap-4 border border-slate-100 rounded-xl p-3"
        >
          <img
            src={`${API_URL}${item.product.image}`}
            alt={item.product.title}
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {item.product.title}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {item.product.price} ETB × {item.quantity}
            </p>
          </div>
          <div className="text-sm font-semibold text-slate-900 shrink-0">
            {order.total_price} ETB
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderComponent;
