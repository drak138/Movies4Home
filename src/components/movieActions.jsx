import { useContext, useEffect, useState } from "react"
import { DownloadContext } from "../context/donwloadContext"
import axios from "axios"
import UseLibrariesHook from "../hooks/useLibrariesHook"
import { AuthContext } from "../context/authContext"
import Message from "./messageBox"
import { removeSaved, submitHandler } from "../pages/library"

export default function MovieActions({title,mediaType,details,season,seasonsCount,id}){
    const{token,user}=useContext(AuthContext)
    const [showLib,setShowLib]=useState(false)
    const [canDowloand,setCanDownload]=useState(false)
    const [loading,setLoading]=useState(true)
    const [movieTorrentLink,setMovieTorrentLink]=useState("")
    const [refetchTrigger, setRefetchTrigger] = useState(false);
    const [showMsg,setShowMsg]=useState(false)
    const [addForm,setAddForm]=useState(false)
    const [message,setMessage]=useState("")
    const [name,setName]=useState("")
    const [selectedLibraryIds, setSelectedLibraryIds] = useState([]);
    const {count,downloadMovie}=useContext(DownloadContext)
    const { libraries } = UseLibrariesHook({
        token,
        userId: user?._id,
        username: user?.username,
        refetchTrigger
      });
    const url=`https://yts.mx/movies/${title}`
    function encodeMovieName(movieName) {
        return encodeURIComponent(movieName?.replace(':', '').toLowerCase().replace(/\s+/g, '-'));
      }
    const originName= `${details?.release_date?details?.release_date.split("-")[0]:details?.first_air_date.split("-")[0]}-`+encodeMovieName(details?.title||details?.name)+`/${seasonsCount==1||seasonsCount==undefined?"":`seasons/${season||1}`}`
    useEffect(()=>{
        setLoading(true)
        setCanDownload(false)
        const fetchLink=async()=>{
            try{
            const res=await axios.get(`https://movies4home.onrender.com/api/hrefStealer?url=${encodeURIComponent(url)}`)
            setCanDownload(res.data.success)
            setMovieTorrentLink(res.data.torrentLink)
        }catch(error){
                
        }
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
    useEffect(() => {
        if (libraries && id) {
          const savedIn = libraries
            .filter((lib) => lib.movies.some((saved) => saved.id === id))
            .map((lib) => lib._id);
          setSelectedLibraryIds(savedIn);
        }
      }, [libraries, id]);

    const showMsgHandler=({set,message})=>{
        setMessage(message)
        setShowMsg(set)
    }
    const downloadHandler=()=>{
        window.location.href=movieTorrentLink
        downloadMovie()
    }
    async function addToLibrary({type,librariesId}){
        const body={movieId:id,mediaType,action:"add Movie"}
        if(type){
            body.type=type
        }
        if(librariesId){
            body.librariesId=librariesId
        }
        try{
       await axios.put("https://movies4home.onrender.com/api/library/add",
       body,
       {headers:{Authorization: `Bearer ${token}`}}).then((res)=>{
        const response=res
       })
       setSelectedLibraryIds((prev) => [...new Set([...prev, ...librariesId])]);
       setRefetchTrigger((prev)=>!prev)
        }catch(error){
        }
    }
        async function addHandler({library}){
        const selectedLibraries = [library._id]
;

        try{
            if(library.movies.some((saved)=>saved.id==id)){
            await removeSaved({libraryId:library._id,savedId:id,action:"remove",token,setRefetchTrigger})
            setSelectedLibraryIds((prev) => prev.filter((libId) => libId !== library._id))
            }
            else{
            await addToLibrary({ librariesId: selectedLibraries });
            setSelectedLibraryIds((prev) => [...new Set([...prev, library._id])]);
            }

        }
        catch(error){
        }

    }
    return(
        <section className="movieInteraction">
        <div className="smallStuff">
        <button style={{color:libraries[0]?.movies.some(saved=>saved.id==id)||selectedLibraryIds.includes(libraries[0]?._id)?"orange":"white"}} onClick={()=>{user?addToLibrary({type:"liked",librariesId: [libraries[0]._id]}):showMsgHandler({set:true,message:"You have to be logged in to Give a Like!"})}} className="like"><i className="fa-solid fa-thumbs-up"></i></button>
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
        <button onClick={(e)=>{user?setShowLib(!showLib):showMsgHandler({set:true,message:"You have to be logged in to have a Library!"})}}>Save to Library <i className="fa-solid fa-plus"></i></button>
        {showMsg&&(<Message message={message} show={showMsg} setShow={setShowMsg}/>)}
        {showLib?
            <div className="addToLibrary">
                {!addForm?
                <>
                <h3>Add Movie</h3>
                <button onClick={()=>setAddForm(true)} className="addLibraryBtn"><i className="fa-solid fa-plus"></i></button>
                <form className="libraryForm">
                    <ul className="libraryList custom-scroll">
                   {libraries.map((library)=>
                    <label  key={library._id} htmlFor={library._id}>
                    <input onChange={(e)=>{addHandler({library})}} type="checkbox" disabled={library.members.find((el)=>el.username==user.username)?.role=="viewer"} checked={selectedLibraryIds.includes(library._id) || library.movies.some(saved => saved.id === id)||library.members.find((el)=>el.username==user.username)?.role=="viewer"} name="library" id={library._id} value={library._id}/>
                    <svg viewBox="0 0 64 64" height="0.7em" width="0.7em">
                    <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 
                    90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 
                    56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 
                    V 16" pathLength="575.0541381835938" className="path">
                    </path>
                    </svg>
                    {library.name}
                    </label>
                   )
                   }
                   </ul>
                <div className="flex-row">
                <button onClick={(e)=>setShowLib(!showLib)} className="cancelBtn">Close</button>
                </div>
                </form>
                </>:
                <form className="addLibrary" onSubmit={(e)=>{submitHandler({e,type:"Add Library",name,token,setName,setRefetchTrigger});setAddForm(false)}}>
                <label style={{marginLeft:"5px"}} htmlFor="name">Name: <input value={name} onChange={(e)=>setName(e.target.value)} style={{width:"70%"}} type="text" /></label>
                <div className="flex-row">
                <button>Add Library</button>
                <button onClick={(e)=>setAddForm(false)} className="cancelBtn">Cancel</button>
                </div>
                </form>
                }
            </div>:null
        }
        </div>
        
        </div>
    </section>
    )
}