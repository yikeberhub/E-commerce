export const processPayment = async (amount) => {
  const response = await fetch("http://localhost:8000.payments/process", {
    method: "POST",
    body: JSON.stringify({ amount }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
