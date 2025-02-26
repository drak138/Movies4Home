import { useState, useEffect } from "react";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function useDetailsHook({ movieId }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}`
        );
        const data = await res.json();
        setMovieDetails(data); // Set movie details in state
      } catch (err) {
        setError("Failed to fetch movie details");
        console.log(err);
      }
    };

    if (movieId) {
      fetchMovieDetails(); // Only fetch if movieId is provided
    }
  }, [movieId]); // Runs when movieId changes

  return { movieDetails, loading, error };
}

