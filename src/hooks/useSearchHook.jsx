import axios from "axios";
import { useEffect, useState } from "react";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const inMemoryCache = new Map();

export default function UseSearchHook({ query }) {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);

      if (inMemoryCache.has(query)) {
        setSearch(inMemoryCache.get(query));
        setLoading(false);
        return;
      }

      try {
        const firstRes = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=1&query=${query}`
        );
        const firstData = await firstRes.json();
        const maxPages = firstData.total_pages || 1;

        const allPages = Array.from({ length: maxPages }, (_, i) => i + 1);
        const batchSize = 60;
        const batchedResults = [];

        for (let i = 0; i < allPages.length; i += batchSize) {
          const batch = allPages.slice(i, i + batchSize);
          const responses = await Promise.all(
            batch.map(page =>
              axios.get(
                `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=${page}&query=${query}`,
                { signal }
              ).then(res => res.data)
            )
          );
          batchedResults.push(...responses);
          if (i + batchSize < allPages.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        let allResults = [];
        batchedResults.forEach(data => {
          const filtered = data.results?.filter(item =>
            item.media_type !== "person" &&
            (item.vote_count >= 150 || (item.popularity >= 15 && item.vote_average > 0))
          ) || [];
          allResults = [...allResults, ...filtered];
        });

        allResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
        allResults.sort((a, b) => b.popularity - a.popularity);

        const groupedResults = [];
        for (let i = 0; i < allResults.length; i += 20) {
          groupedResults.push(allResults.slice(i, i + 20));
        }

        inMemoryCache.set(query, groupedResults);
        setSearch(groupedResults);
        setLoading(false);
      } catch (error) {
        if (error.name === "CanceledError") return;
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [query]);

  return { search, loading };
}
