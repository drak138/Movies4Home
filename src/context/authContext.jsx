import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const verify=async()=>{
    if (token) {
      await axios.get("http://localhost:5001/api/verifyToken", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(false));
    }
  }
  verify()
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}
