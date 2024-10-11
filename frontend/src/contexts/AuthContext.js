import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState({
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Function to set tokens and user information
  const setTokens = async (tokens, callback) => {
    setAuthTokens(tokens);
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);

    await fetchUserInfo();
    if (callback) {
      callback();
    }
  };

  const clearTokens = () => {
    setAuthTokens({});
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const fetchUserInfo = async () => {
    if (!authTokens.access) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 401) {
        await refreshTokens();
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const refreshTokens = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/users/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: authTokens.refresh }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTokens(data);
      } else {
        clearTokens();
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to refresh tokens:", error);
      clearTokens();
    }
  };

  const logout = () => {
    clearTokens();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        user,
        loading,
        setTokens,
        clearTokens,
        logout,
        fetchUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
