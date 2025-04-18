import { useEffect, useState } from "react";

export default function MoviePlayer({mediaType,id,details,season,episode}){
    const [watching,setWatching]=useState(false)
    const [showServers,setShowServers]=useState(false)
    const [server,setServer]=useState("")
    useEffect(()=>{
        setWatching(false)
        setShowServers(false)
        setServer({"name":"Alpha","src":`https://vidfast.pro/${mediaType}/${mediaType==="tv"?details?.external_ids?.imdb_id:details?.imdb_id}${mediaType==="tv"?`/${season==undefined?1:season}/${episode==undefined?1:episode}`:""}?autoPlay=true`})
    },[season,episode,id,details])
    return(
        <div className="playerContainer">
        {!watching?
        <>
        <div onClick={e=>setShowServers(!showServers)} className="servers">
            <span><i className="fa-solid fa-server"></i> Select a Server</span>
        </div>
        <img onClick={e=>setWatching(true)} className="loadingImg" src={`https://image.tmdb.org/t/p/original${details?.backdrop_path}`} alt="" />
        <i onClick={e=>setWatching(true)} className="fa-solid fa-play onHover"></i>
        {mediaType=="tv"?null:<p className="runtime">{details?.runtime}min</p>}
        </>:
        <>
        <div onClick={e=>setShowServers(!showServers)} className="servers">
            <span><i className="fa-solid fa-server"></i> Select a Server</span>
        </div>
        <iframe
  src={server.src}
  style={{ width: "100%", height: "100%" }}
  frameBorder="0"
  referrerPolicy="origin"
  allowFullScreen
></iframe>
</>}
    {showServers&&<ul className="serverList">
        <span onClick={e=>setShowServers(false)} className="exitServers">X</span>
        <li className={`server ${server.name=="Alpha"?"selected-server":""}`} onClick={e=>{setShowServers(false);setServer({"name":"Alpha","src":`https://vidfast.pro/${mediaType}/${mediaType==="tv"?details?.external_ids.imdb_id:details?.imdb_id}${mediaType==="tv"?`/${season==undefined?1:season}/${episode==undefined?1:episode}`:""}?autoPlay=true`})}}>
            Alpha <img className="flag" src="https://www.svgrepo.com/show/248851/united-states.svg" alt="" />
            <p>Recommended</p>
        </li>
        <li className={`server ${server.name=="Bravo"?"selected-server":""}`} onClick={e=>{setShowServers(false);setServer({"name":"Bravo","src":`https://vidsrc.me/embed/${mediaType}?imdb=${mediaType==="tv"?details?.external_ids.imdb_id:details?.imdb_id}${mediaType==="tv"?`&season=${season}&episode=${episode}`:""}`})}}>
            Bravo<img className="flag" src="https://www.svgrepo.com/show/248851/united-states.svg" alt="" />
            <p>Optional</p>
        </li>
        </ul>}
        </div>
    )
}