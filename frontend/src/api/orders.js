export const updateOrderStatus = async (orderId, status, transactionId) => {
  await fetch(`/api/orders/${orderId}/update`, {
    method: "POST",
    body: JSON.stringify({ status, transactionId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
