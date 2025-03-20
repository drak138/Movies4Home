import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { AuthContext } from "../context/authContext";

function useAuthExpiration() {
    const{user,setUser}=useContext(AuthContext)

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      return;
    }

    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp*1000;
    const currentTime = Date.now();
    if (expirationTime < currentTime) {
      Cookies.remove("token");
      setUser(false)

    } else {
      const timeRemaining = expirationTime - currentTime;
      setTimeout(() => {
        Cookies.remove("token");
        setUser(false)
      }, timeRemaining);
    }
  }, [user]);
}

export default useAuthExpiration;
