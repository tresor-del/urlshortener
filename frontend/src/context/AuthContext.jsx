import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// create autentication context
const AuthContext = createContext();

// custom hook for using authentication
export const useAuth = () => {
  return useContext(AuthContext);
};

// authentication context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);


  const setLogin = (newToken, userInfo) => {

    if (!newToken || !userInfo){
      console.error('SetLogin error: missing token or userInfo')
    }

    setToken(newToken);
    localStorage.setItem('token', newToken)

    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem('token')
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
