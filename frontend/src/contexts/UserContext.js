import { createContext, useState } from "react";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const handleSetUser = (user) => {
    localStorage.removeItem("user");
    console.log("passed user is:", user);
    localStorage.setItem("user", user);
    setUser(window.localStorage.getItem("user"));
    console.log(
      "my storage user is:",
      window.localStorage.getItem("user").email
    );
    console.log("my context user is:", localStorage.getItem("user"));
  };

  const handleSetUserEmail = (email) => {
    localStorage.setItem("userEmail", email);
    setUserEmail(localStorage.getItem("userEmail"));

    console.log("my current user email:", userEmail);
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        onSetUser: handleSetUser,
        onSetUserEmail: handleSetUserEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export { UserProvider, UserContext };
