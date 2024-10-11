import { useLocation } from "react-router-dom";
const PaymentConfirmation = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const trx_ref = queryParams.get("trx_ref");

  return (
    <div>
      <h1>Payment Confirmation</h1>

      <p>Transaction Reference: {trx_ref}</p>
    </div>
  );
};

export default PaymentConfirmation;
