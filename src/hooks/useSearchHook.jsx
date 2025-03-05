import { useEffect, useState } from "react";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseSearchHook({ query, page }) {
  const [search, setSearch] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=${page}&query=${query}`
        );
        const data = await res.json();

        // Filter results where only TV series apply the popularity rule
        const filteredResults = data.results?.filter(item => {
          if (item.media_type === "tv") {
            return item.popularity >= 50;  // Only apply the rule for TV series
          }
          else if(item.media_type==="person"){
            return
          }
          return item.popularity>=5;  // Allow all other media types (e.g., movies) without filtering
        }) || [];

        setSearch({ ...data, results: filteredResults });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [page, query]);

  return { search };
}

