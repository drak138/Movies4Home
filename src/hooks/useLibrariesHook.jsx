import axios from "axios";
import { useEffect, useState } from "react";

export default function UseLibrariesHook({userId, username, token,refetchTrigger,refetchMovieTrigger}) {
  const [libraries, setLibraries] = useState([]);
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    const getLibraries = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const response = await axios.get("https://movies4home.onrender.com/api/library/", {
          params: { userId,username},
          headers: { Authorization: `Bearer ${token}` },
        })
        setLibraries(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (token && userId && username) {
      if (refetchMovieTrigger) {
        getLibraries(false);
      } else {
        getLibraries(true);
      }
    }
  }, [token,userId,username,refetchTrigger,refetchMovieTrigger]);

  return { libraries,loading };
}