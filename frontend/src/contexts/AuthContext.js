import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  Children,
} from "react";

const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fethUserFromToken(1);
    }
  }, []);

  const fethUserFromToken = async (id) => {
    const response = await fetch("/shop/get-user/", {
      method: "post",
      headers: {
        // authorization: `Bearer${id}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(id),
    });
    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
    } else {
      console.log("error fetching");
    }
  };

  const login = async (Credentials) => {
    const user = await login(Credentials);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
