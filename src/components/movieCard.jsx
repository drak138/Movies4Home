import {Link} from 'react-router'
export default function MovieCard({movie}){
    const { poster_path, vote_average, id, release_date, title,first_air_date,name } = movie;
    const posterUrl=`https://image.tmdb.org/t/p/w200${poster_path}`
    return(
        <Link className="movieCard">
            <div style={{backgroundImage:`url(${posterUrl})`}} className="moviePoster">
            <p className="year">{release_date?release_date.split("-")[0]:first_air_date.split("-")[0]}</p>
            <p className="rating">
              <i className="fa-solid fa-star"></i>
              <span>{vote_average.toFixed(1)}</span>
            </p>
            </div>
            <p className="title">{title?title:name}</p>
        </Link>
    )

}