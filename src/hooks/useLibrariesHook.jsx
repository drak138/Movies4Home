import axios from "axios";
import { useEffect, useState } from "react";

export default function UseLibrariesHook({userId, username, token,refetchTrigger}) {
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    const getLibraries = async () => {
      try {
        const response = await axios.get("https://movies4home.onrender.com/api/library/", {
          params: { userId,username},
          headers: { Authorization: `Bearer ${token}` },
        });
        setLibraries(response.data);
      } catch (error) {
      }
    };

    if (token&& userId && username) {
      getLibraries();
    }
  }, [token,userId,username,refetchTrigger]);

  return { libraries };
}

