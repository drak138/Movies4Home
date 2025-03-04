import { useState } from "react";

export default function MoviePlayer({mediaType,id,details}){
    const [watching,setWatching]=useState(false)
    const season=1
    const episode=1
    return(
        // <div className="movieWrapper">
        //     <img src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`} alt="" />
        // </div>
        <div className="playerContainer">
        {!watching?
        <>
        <img onClick={e=>setWatching(true)} className="loadingImg" src={`https://image.tmdb.org/t/p/original${details?.backdrop_path}`} alt="" />
        <i onClick={e=>setWatching(true)} className="fa-solid fa-play onHover"></i>
        <p className="runtime">{details?.runtime}min</p>
        </>:
         <iframe
  src={`https://vidsrc.me/embed/${mediaType}?imdb=${mediaType==="tv"?details?.external_ids.imdb_id:details?.imdb_id}${mediaType==="tv"?`&season=${season}&episode=${episode}`:""}`}
  style={{ width: "100%", height: "100%" }}
  frameBorder="0"
  referrerPolicy="origin"
  allowFullScreen
></iframe>}
        </div>
    )
}