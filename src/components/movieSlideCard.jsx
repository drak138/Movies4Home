import React from "react";
import useImagesHook from "../hooks/useImagesHook";
import { Link } from "react-router-dom";

export default function MovieSlideCard({ movie }) {
  const { backdrop_path, vote_average, id, release_date, overview, title } = movie;
  const {images}=useImagesHook({ movieId:id ,mediaType:"movie"})
  function encodeMovieName(movieName) {
    return encodeURIComponent(movieName.replace(':', '').toLowerCase().replace(/\s+/g, '-'));
  }
  const encodedName = encodeMovieName(title?title+`-${release_date.split("-")[0]}`:name);

  const backdropUrl = `https://image.tmdb.org/t/p/original${backdrop_path}`;  // Full size image


  return (
    <article className="movieSlide" style={{backgroundImage:`url(${backdropUrl})`}}>
      <div className="movieSlideContainer">
        <div className="details">
          <img
            src={`https://image.tmdb.org/t/p/w300/${images?.logos.filter(iso=>iso.iso_639_1=="en")[0]?images?.logos.filter(iso=>iso.iso_639_1=="en")[0].file_path:""}`}
            alt={title}
          />
          <div className="flex-row">
            <p className="type">Movie</p>
            <p className="year">{release_date.split("-")[0]}</p>
            <p className="duration">97 min</p>
            <p className="rating">
              <i className="fa-solid fa-star"></i>
              <span>{vote_average.toFixed(1)}</span>
            </p>
          </div>
        </div>
        <p className="shortDesc">{overview}</p>
        <Link className="watchNow" to={`/watch/movie/${encodedName}/${id}`}>Watch now!</Link>
      </div>
    </article>
  );
}
