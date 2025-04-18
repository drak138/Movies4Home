import { useState, useEffect } from "react";
import axios from "axios";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseSimilarHook({ mediaType, genres = "", id }) {
    const [similar, setSimilar] = useState([]);

    useEffect(() => {    
        const fetchSimilar = async () => {
            try {

                const response = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}/recommendations`, {
                    params: {
                        api_key: TMDB_KEY,
                    }
                });

                let results = response.data.results;
                    results = results.slice(0, 20);

                setSimilar(results);
            } catch (error) {
                console.error("Error fetching similar movies:", error);
            }
        };

        if (id) fetchSimilar();
    }, [mediaType, genres, id]);

    return { similar };
}

