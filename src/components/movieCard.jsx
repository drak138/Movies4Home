import {Link} from 'react-router'
export default function MovieCard({movie}){
    const { poster_path, vote_average, id, release_date, title,first_air_date,name } = movie;
    const posterUrl=`https://image.tmdb.org/t/p/w500${poster_path}`
    function encodeMovieName(movieName) {
      //insert special cases
      if(movieName=="X2"){
        movieName="X2: X-Men United"
      }
      if(movieName=="Dark Phoenix"){
        movieName="X-Men: Dark Phoenix"
      }
        return encodeURIComponent(movieName.replace(':', '').replace("&","").toLowerCase().replace(/\s+/g, '-'));
      }
      const encodedName = encodeMovieName(title?title:name)+`-${release_date?release_date?.split("-")[0]:first_air_date?.split("-")[0]}`;
    return(
        <Link to={`/watch/${title?"movie":"tv"}/${encodedName}/${id}`} className="movieCard">
            <div className='posterHolder'>
            <p className="year">{release_date?release_date?.split("-")[0]:first_air_date?.split("-")[0]}</p>
            <p className="rating">
              <i className="fa-solid fa-star"></i>
              <span>{vote_average?.toFixed(1)}</span>
            </p>
            <i className="fa-solid fa-play onHover"></i>
            <img className='moviePoster' src={posterUrl} alt="" />
            </div>
            <p className="title">{title?title:name}</p>
        </Link>
    )

}