import { useState, useEffect } from "react";
import MovieSlideCard from "./movieSlideCard";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieCarousel() {
  const [nowPlaying, setNowPlaying] = useState([]);  
  const [currentIndex, setCurrentIndex] = useState(0); 

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}`
        );
        const nowPlayingData = await res.json();
        const filteredMovies = nowPlayingData.results
          .filter((movie) => movie.original_language === "en")
          .slice(0, 5);
        setNowPlaying(filteredMovies); 

      } catch (error) {
        console.log(error);
      }
    };
    fetchNowPlaying();
  }, []); 

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === nowPlaying.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval); 
  }, [nowPlaying.length]);

  return (
    <section className="playingMovies">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 20}%)` }}
        >
          {nowPlaying.map((movie) => (
            <MovieSlideCard key={movie.id} movie={movie} />
          ))}
      </div>
    </section>
  );
}

