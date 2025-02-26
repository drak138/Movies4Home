import { useState, useEffect } from "react";
import useListHook from "../hooks/useListHook";  
import MovieCard from "./movieCard";  

export default function MovieList({listType}) {
  const [type, setType] = useState("movie");  
  const { list } = useListHook({ type,listModel:listType });  
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollAmount = 3; // Number of movies to scroll at a time

  useEffect(() => {
    setCurrentIndex(0); // Reset scroll position when type changes
  }, [type]);

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - scrollAmount, 0));
  };

  const scrollRight = () => {
    if (list?.results) {
      const maxIndex = list.results.length - scrollAmount;
      setCurrentIndex((prevIndex) => Math.min(prevIndex + scrollAmount, maxIndex));
    }
  };

  return (
    <section className="listType">
      <h2>{listType}</h2>
      <div className="choiceHolder">
        <button 
          onClick={e => setType(e.target.value)} 
          value="movie" 
          className={`movieBtn ${type === "movie" ? "selected" : ""}`}
        >
          Movies
        </button>
        <button 
          onClick={e => setType(e.target.value)}  
          value="tv" 
          className={`seriesBtn ${type === "tv" ? "selected" : ""}`}
        >
          Series
        </button>
      </div>

      <div className="movieListWrapper" style={{ position: "relative"}}>

        <div 
          className="movieList" 
          style={{ 
            display: "flex", 
            transform: `translateX(-${currentIndex * 195}px)`, // Adjust per movie width
            transition: "transform 0.5s ease-in-out"
          }}
        >
          {list?.results?.length > 0 ? (
            list.results.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))
          ) : (
            <p>No movies or series found.</p>
          )}
        </div>
        {currentIndex > 0 && (
          <button onClick={scrollLeft} className="movieSliderBtn left">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}

        {list?.results && currentIndex < list.results.length - scrollAmount && (
          <button onClick={scrollRight} className="movieSliderBtn right">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        )}
      </div>
    </section>
  );
}
