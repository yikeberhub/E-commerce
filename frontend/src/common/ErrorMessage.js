import React, { useState } from "react";

function ErrorMessage() {
  const [message, setMessage] = useState({
    email: "",
    password: "",
  });
  return (
    <div>
      <h3>Error message is here!!! {message}</h3>
    </div>
  );
}

export default ErrorMessage;
