import MoviePlayer from "../components/moviePlayer";
import { useParams} from "react-router-dom";
import UseDetailsHook from "../hooks/useDetailsHook";
import MovieActions from "../components/movieActions";
import MovieInfo from "../components/movieInfo";
import TvSeasons from "../components/tvSeasons";

export default function Movie(){
    const {mediaType,id,title,season,episode} = useParams()
    const res=UseDetailsHook({type:mediaType,movieId:id})
    const details=res.movieDetails
    return(
        <div className="playerWrapper">
        <section className="movieDetails">
            <MoviePlayer mediaType={mediaType} id={id} details={details} season={season} episode={episode}/>
            <MovieActions title={title} id={id}/>
            <MovieInfo details={details} id={id} title={title} mediaType={mediaType}/>

            {mediaType=="tv"?<TvSeasons details={details} id={id}/>:null}
        </section>
        {/* <SimilarMovies/> */}
        </div>
    )
}