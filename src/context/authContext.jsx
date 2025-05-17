import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    const controller = new AbortController();
    const verify = async () => {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, _id: decoded._id, username: decoded.username });
        const res = await axios.get("https://movies4home.onrender.com/api/verifyToken", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        setUser(res.data.user);
      } catch (error) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          setUser(false);
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      verify();
    } else {
      setUser(false);
      setLoading(false);
    }
    return () => {
      controller.abort();
    };
  }, [token]);

  const logout = () => {
    Cookies.remove("token");
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

