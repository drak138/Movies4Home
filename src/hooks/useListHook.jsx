import { useEffect, useState } from "react";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function useListHook({ type, listModel }) {
    const [list, setList] = useState([]);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (!TMDB_KEY) {
            return;
        }

        let newUrl = "";
        switch (listModel) {
            case "Trending":
                newUrl = `https://api.themoviedb.org/3/${type}/popular?api_key=${TMDB_KEY}&language=en-US`;
                break;
            case "Latest":
                const today = new Date().toISOString().split("T")[0]; 
                newUrl = `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_KEY}&language=en-US&sort_by=release_date.desc&page=1&with_original_language=en&release_date.lte=${today}&vote_count.gte=100`;
                break;
            case "Top Rated":
                newUrl = `https://api.themoviedb.org/3/${type}/top_rated?api_key=${TMDB_KEY}&language=en-US`;
                break;
            default:
                return;
        }

        setUrl(newUrl);
    }, [type, listModel]);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            try {
                const res = await fetch(url);
                
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const data = await res.json();

                setList(data || []);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchData();
    }, [url]);

    return { list };
}
