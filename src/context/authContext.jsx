import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    const verify=async()=>{
      await axios.get("https://movies4home.onrender.com/api/verifyToken", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(false))
        .finally(()=>
          setLoading(false)
        )
  }
  verify()
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, token,loading }}>
      {children}
    </AuthContext.Provider>
  );
}
