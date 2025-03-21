import { useState, useEffect } from "react";
import MovieSlideCard from "./movieSlideCard";
import axios from "axios";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieCarousel() {
  const [nowPlaying, setNowPlaying] = useState([]);  
  const [currentIndex, setCurrentIndex] = useState(0); 

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}`,
        {
          params:{
          region:"BG",
          "vote_count.gte": 400,
          with_release_type: "2|3",
          sort_by: "primary_release_date.desc"
          }
        });
        const nowPlayingData = res.data;
        const filteredMovies = nowPlayingData.results
          .filter((movie) => movie.original_language === "en")
          .slice(0, 7);
        setNowPlaying(filteredMovies); 

      } catch (error) {
      }
    };
    fetchNowPlaying();
  }, []); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === nowPlaying.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);

    return () => clearInterval(interval); 
  }, [nowPlaying.length]);

  return (
    <section className="playingMovies">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 14.3}%)` }}
        >
          {nowPlaying.map((movie) => (
            <MovieSlideCard key={movie.id} movie={movie} />
          ))}
      </div>
    </section>
  );
}

