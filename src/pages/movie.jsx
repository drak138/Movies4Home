import MoviePlayer from "../components/moviePlayer";
import { useParams} from "react-router-dom";
import UseDetailsHook from "../hooks/useDetailsHook";
import MovieActions from "../components/movieActions";
import MovieInfo from "../components/movieInfo";
import TvSeasons from "../components/tvSeasons";
import Similar from "../components/similar";
import SeriesActions from "../components/seriesAction";

export default function Movie(){
    const {mediaType,id,title,season,episode} = useParams()
    const res=UseDetailsHook({type:mediaType,movieId:id})
    const details=res.movieDetails
    return(
        <div className="playerWrapper">
        <section className="movieDetails">
            <MoviePlayer mediaType={mediaType} id={id} details={details} season={season} episode={episode}/>
            <div className="actionsHolder">
            {episode?<SeriesActions season={season} episode={episode} lastEpisode={details?.last_episode_to_air||{}} title={title}/>:null}
            <MovieActions title={title} mediaType={mediaType} details={details} season={season} seasonsCount={details?.number_of_seasons}/>
            </div>
            <MovieInfo details={details} id={id} title={title} mediaType={mediaType}/>

            {mediaType=="tv"?<TvSeasons details={details} id={id}/>:null}
        </section>
        <section className="similarSection">
            <Similar details={details} mediaType={mediaType}/>
        </section>
        </div>
    )
}