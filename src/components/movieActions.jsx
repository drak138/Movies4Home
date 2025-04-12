import { useContext, useEffect, useState } from "react"
import { DownloadContext } from "../context/donwloadContext"
import axios from "axios"
import UseLibrariesHook from "../hooks/useLibrariesHook"
import { AuthContext } from "../context/authContext"
import Message from "./messageBox"
import { submitHandler } from "../pages/library"

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
        setRefetchTrigger((prev)=>!prev)
       })
        }catch(error){
        }
    }
    const addHandler=async(e)=>{
        e.preventDefault()
        const formData = new FormData(e.target);
        const selectedLibraries = formData.getAll("library");
        if(selectedLibraries.length<1){
            return
        }
        try{
            await addToLibrary({ librariesId: selectedLibraries });
            setShowLib(false);
        }
        catch(error){
        }

    }
    return(
        <section className="movieInteraction">
        <div className="smallStuff">
        <button style={{color:libraries[0]?.movies.some(saved=>saved.id==id)?"orange":"white"}} onClick={()=>{user?addToLibrary({type:"liked"}):showMsgHandler({set:true,message:"You have to be logged in to Give a Like!"})}} className="like"><i className="fa-solid fa-thumbs-up"></i></button>
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
                <form className="libraryForm" onSubmit={addHandler}>
                   {libraries.map((library)=>
                    <label key={library._id} htmlFor={library._id}><input type="checkbox" disabled={library.movies.some(saved=>saved.id==id)} defaultChecked={library.movies.some(saved=>saved.id==id)} name="library" id={library._id} value={library._id}/>{library.name}</label>
                   )
                   }
                <div className="flex-row">
                <button className="saveBtn">Save</button>
                <button onClick={(e)=>setShowLib(!showLib)} className="cancelBtn">Cancel</button>
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