import { useEffect, useState } from "react";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function useImagesHook({ movieId }) {
  const [images, setImages] = useState(null);

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${TMDB_KEY}`
        );
        const movieImages = await res.json();
        setImages(movieImages); // Set the images
      } catch (error) {
        console.log(error);
      }
    };

    if (movieId) {
      fetchImg(); // Only fetch if movieId is provided
    }
  }, [movieId]); // Trigger the effect only when `movieId` changes

  return { images }; // Return images
}
