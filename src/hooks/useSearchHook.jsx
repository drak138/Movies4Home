import { useEffect, useState } from "react";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseSearchHook({ query, page }) {
  const [search, setSearch] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch to get total pages
        const firstRes = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=1&query=${query}`
        );
        const firstData = await firstRes.json();
        const maxPages = firstData.total_pages || 1;

        let allResults = [];
        for (let i = 1; i <= maxPages; i++) {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=${i}&query=${query}`
          );
          const data = await res.json();

          const filteredResults = data.results?.filter(item => {
            if (item.media_type === "tv") {
              return item.popularity >= 20;
            } else if (item.media_type === "person") {
              return false;
            }
            return item.popularity >= 5;
          }) || [];

          allResults = [...allResults, ...filteredResults];
        }
        const groupedResults = [];
        for (let i = 0; i < allResults.length; i += 20) {
          groupedResults.push(allResults.slice(i, i + 20));
        }
        setSearch(groupedResults);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [page, query]);

  return { search };
}


