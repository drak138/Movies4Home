import { useEffect, useState } from "react"

export default function MovieActions({title,id}){
    const [showLib,setShowLib]=useState(false)
    const [canDowloand,setCanDownload]=useState(false)
    const [loading,setLoading]=useState(true)
    const [movieTorrentLink,setMovieTorrentLink]=useState("")
    const url=`https://yts.mx/movies/${title}`
    useEffect(()=>{
        const fetchLink=async()=>{
            const res=await fetch(`https://movies4home.netlify.app/.netlify/functions/hrefStealer?url=${encodeURIComponent(url)}`)
            const data=await res.json()
            setCanDownload(data.success)
            setMovieTorrentLink(data.torrentLink)
            setLoading(false)
        }
        fetchLink()
    },[])
    return(
        <section className="movieInteraction">
        <div className="smallStuff">
        <button className="like"><i className="fa-solid fa-thumbs-up"></i></button>
        <button className="dislike"><i className="fa-solid fa-thumbs-down"></i></button>
        {canDowloand ?
        <a href={movieTorrentLink} className="downloadBtn">
  {loading ? "Loading" : "Download Movie"}</a>
         :<p className="downloadBtn">
         {loading ? "Loading" : "No 1080p torrent link found"}
         </p>
         }
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