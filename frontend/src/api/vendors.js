export const updateVendorPayment = async (vendorId, amount) => {
  await fetch(`/api/vendors/${vendorId}/payment`, {
    method: "POST",
    body: JSON.stringify({ amount }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
