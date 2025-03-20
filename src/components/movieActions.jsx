import { useContext, useEffect, useState } from "react"
import { DownloadContext } from "../context/donwloadContext"

export default function MovieActions({title,mediaType,details,season,seasonsCount}){
    const [showLib,setShowLib]=useState(false)
    const [canDowloand,setCanDownload]=useState(false)
    const [loading,setLoading]=useState(true)
    const [movieTorrentLink,setMovieTorrentLink]=useState("")
    const {count,downloadMovie}=useContext(DownloadContext)

    const url=`https://yts.mx/movies/${title}`
    function encodeMovieName(movieName) {
        return encodeURIComponent(movieName?.replace(':', '').toLowerCase().replace(/\s+/g, '-'));
      }
    const originName= `${details?.release_date?details?.release_date.split("-")[0]:details?.first_air_date.split("-")[0]}-`+encodeMovieName(details?.title||details?.name)+`/${seasonsCount==1||seasonsCount==undefined?"":`seasons/${season||1}`}`
    useEffect(()=>{
        setLoading(true)
        setCanDownload(false)
        const fetchLink=async()=>{
            const res=await fetch(`https://movies4home.onrender.com/api/hrefStealer?url=${encodeURIComponent(url)}`)
            const data=await res.json()
            setCanDownload(data.success)
            setMovieTorrentLink(data.torrentLink)
            setLoading(false)
        }
        if(mediaType=="tv"){
            setCanDownload(false)
            setLoading(false)
        }
        else{
        fetchLink()
        }
    },[title])
    const downloadHandler=()=>{
        // window.location.href=movieTorrentLink
        downloadMovie()
    }
    return(
        <section className="movieInteraction">
        <div className="smallStuff">
        <button className="like"><i className="fa-solid fa-thumbs-up"></i></button>
        <button className="dislike"><i className="fa-solid fa-thumbs-down"></i></button>
        {canDowloand ?
        (
        count>0?
        (
        <button onClick={downloadHandler} className="downloadBtn">Download Movie</button>
        )
        :
        <p className="downloadBtn">You have ran out of Donwloads</p>
        )
        :
        (
        <p className="downloadBtn">{loading ? "Loading" : "No 1080p torrent link found"}</p>
         )}
         <a className="downloadBtn" href={`https://www.opensubtitles.com/en/${mediaType=="movie"?"movies":"tvshows"}/${originName}`} target="_blank">Donwload Subtitles</a>
        <div>
        <button onClick={(e)=>setShowLib(!showLib)}>Save to Library <i className="fa-solid fa-plus"></i></button>
        {showLib?
            <div className="addToLibrary">
                <h3>Add Movie</h3>
                <button className="addLibraryBtn"><i className="fa-solid fa-plus"></i></button>
                <form className="libraryForm" action="" method="POST">
                    <label htmlFor="library1Id"><input type="checkbox" id="library1Id" value="library1Id"/>library1Name</label>
                    <label htmlFor="library2Id"><input type="checkbox" id="library2Id" value="library2Id"/>library2Name</label>
                    <label htmlFor="library3Id"><input type="checkbox" id="library3Id" value="library3Id"/>library3Name</label>
                </form>
                <div className="flex-row">
                <button className="saveBtn">Save</button>
                <button onClick={(e)=>setShowLib(!showLib)} className="cancelBtn">Cancel</button>
                </div>
            </div>:null
        }
        </div>
        
        </div>
    </section>
    )
}