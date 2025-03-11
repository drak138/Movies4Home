import { useState, useEffect } from "react";
import axios from "axios";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseSimilarHook({ mediaType, genres = "", id }) {
    const [similar, setSimilar] = useState([]);

    useEffect(() => {    
        const fetchSimilar = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/${mediaType}`, {
                    params: {
                        api_key: TMDB_KEY,
                        with_genres: genres,
                        sort_by: "popularity.dec",
                        with_original_language: "en||ja",
                    }
                });

                let results = response.data.results;

                results = results.filter(item => item.id !== id);

                if (results.length < 20) {
                    const extraResults = await axios.get(`https://api.themoviedb.org/3/discover/${mediaType}`, {
                        params: {
                            api_key: TMDB_KEY,
                            with_genres: genres,
                            sort_by: "popularity.dec",
                            page: 2,
                            with_original_language: "en||ja",
                        }
                    });
                    const extraItems = extraResults.data.results?.filter(item => item.id !== id);
                    results = [...results, ...extraItems].slice(0, 20);
                } else {
                    results = results.slice(0, 20);
                }

                setSimilar(results);
            } catch (error) {
                console.error("Error fetching similar movies:", error);
            }
        };

        if (genres) fetchSimilar();
    }, [mediaType, genres, id]);

    return { similar };
}

