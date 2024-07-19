import React, { createContext, useContext, useState, useEffect } from "react";

const CsrfContext = createContext();

const useCsrf = () => useContext(CsrfContext);

const CsrfProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch("/shop/getToken/");
      const data = await response.json();
      setCsrfToken(data.token);
    };

    fetchCsrfToken();
  }, []);

  return (
    <CsrfContext.Provider
      value={{
        csrfToken,
        onSetToken: setCsrfToken,
      }}
    >
      {children}
    </CsrfContext.Provider>
  );
};

export { CsrfProvider, CsrfContext };
