import MoviePlayer from "../components/moviePlayer";
import { useParams} from "react-router-dom";
import UseDetailsHook from "../hooks/useDetailsHook";
import MovieActions from "../components/movieActions";
import MovieInfo from "../components/movieInfo";
import TvSeasons from "../components/tvSeasons";
import Similar from "../components/similar";
import SeriesActions from "../components/seriesAction";
import { useEffect, useRef, useState } from "react";
import Comments from "../components/comments";

export default function Movie(){
    const {mediaType,id,title,season,episode} = useParams()
    const [openSeasons,setOpenSeasons]=useState([])
    const sectionRef=useRef({})
    const res=UseDetailsHook({type:mediaType,movieId:id})
    const details=res.movieDetails
    useEffect(()=>{
        setOpenSeasons([])
    },[id])

    const toggleSeason = (season) => {
        setOpenSeasons((prev) =>
            prev.includes(season)
                ? prev.filter((s) => s !== season)
                : [...prev, season]
        );
    };
    const handleScrollAndOpen = () => {
        if (sectionRef.current) {
          sectionRef.current[season].scrollIntoView({ behavior: "smooth" });
          setOpenSeasons((prev) => [...prev, Number(season)]
        );
        }
      };

    return(
        <div className="playerWrapper">
        <section className="movieDetails">
            <MoviePlayer mediaType={mediaType} id={id} details={details} season={season} episode={episode}/>
            <div className="actionsHolder">
            {episode?<SeriesActions season={season} episode={episode} lastEpisode={details?.last_episode_to_air||{}} title={title} handleScrollAndOpen={handleScrollAndOpen}/>:null}
            <MovieActions title={title} mediaType={mediaType} details={details} season={season} seasonsCount={details?.number_of_seasons} id={id}/>
            </div>
            <MovieInfo details={details} id={id} title={title} mediaType={mediaType}/>

            {mediaType=="tv"?<TvSeasons details={details} id={id} sectionRef={sectionRef} openSeasons={openSeasons} toggleSeason={toggleSeason}/>:null}
            <Comments movieId={id}/>
        </section>
        <section className="similarSection">
            <Similar details={details} mediaType={mediaType}/>
        </section>
        </div>
    )
}