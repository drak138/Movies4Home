import axios from "axios";
import { useEffect, useState } from "react";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseSearchHook({ query, page }) {

  const controller = new AbortController();
  const signal = controller.signal;

  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const firstRes = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=1&query=${query}`
        );
        const firstData = await firstRes.json();
        const maxPages = firstData.total_pages || 1;

        const pageRequests = [];
        for (let i = 1; i <= maxPages; i++) {
          pageRequests.push(
            await axios.get(
              `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=${i}&query=${query}`,
              { signal }
            ).then(res => res.data)
          );
        }

        const allData = await Promise.all(pageRequests);

        let allResults = [];
        allData.forEach(data => {
          const filteredResults = data.results?.filter(item => {
            if (item.media_type === "tv") {
              return item.vote_count >= 300;
            } else if (item.media_type === "person") {
              return false;
            }
            return item.vote_count >= 300;
          }) || [];
          allResults = [...allResults, ...filteredResults];
        });

        allResults = Array.from(
          new Map(allResults.map(item => [item.id, item])).values()
        );
        allResults=allResults.sort((a,b)=>b.popularity - a.popularity)

        const groupedResults = [];
        for (let i = 0; i < allResults.length; i += 20) {
          groupedResults.push(allResults.slice(i, i + 20));
        }

        setSearch(groupedResults);
        setLoading(false);

      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { search, loading };
}



