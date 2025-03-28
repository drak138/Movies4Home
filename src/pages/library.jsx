import { useContext,useEffect, useState} from "react"
import MovieCard from "../components/movieCard"
import axios from "axios";
import { AuthContext } from "../context/authContext";
import UseLibrariesHook from "../hooks/useLibrariesHook";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function submitHandler({e, name, selected, token, setName, setRefetchTrigger, type}) {
    e.preventDefault();
    try {
        const body={name}
        if(selected){
            body.libraryId=selected[0]._id
        }
        const command = type === "Add Library" ? axios.post : axios.put;
        await command("http://localhost:5001/api/library",
            body,
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(() => {
            setName("");
            setRefetchTrigger((prev) => !prev);
        });
    } catch (error) {
        const err = error.response?.data?.message;
        alert(err || "Failed to create library");
    }
}

export default function Library(){
    const{token,user}=useContext(AuthContext)
    const [name,setName]=useState("")
    const [refetchTrigger, setRefetchTrigger] = useState(false);
    const [type,setType]=useState("Add Library")
    const [saved,setSaved]=useState([])
    const { libraries } = UseLibrariesHook({
        token,
        userId: user?._id,
        username: user?.username,
        refetchTrigger
      });
      const [selected, setSelected] = useState([]);
      useEffect(() => {
        if (libraries.length > 0) {
            if(selected.length==0){
          setSelected(libraries.filter((library) => library.type === "liked"));
            }
            else{
                setSelected((prev)=>{
                const matchedLibrary = libraries.find((library) => library._id === prev._id);
                return matchedLibrary || prev;
                })
            }
        }
      }, [libraries,selected]);

      useEffect(() => {
        const fetchSavedMovies = async () => {
            if (!selected[0]?.movies) return [];
    
            const movieDetailsPromises = selected[0]?.movies.map(async (movie) => {
                const url = `https://api.themoviedb.org/3/${movie.mediaType}/${movie.id}?api_key=${TMDB_KEY}`;
                const response = await axios.get(url)
                return response.data
            });
    
            const movieDetails = await Promise.all(movieDetailsPromises);
    
            setSaved(movieDetails.reverse())
        };
    
        fetchSavedMovies()
    
    }, [selected]);


    async function deleteLibrary() {
        try{
            await axios.delete("http://localhost:5001/api/library",{
            data: { libraryId: selected[0]._id },
            headers:{Authorization: `Bearer ${token}`}
        }
        ).then(()=>{
                setName("");
                setType("Add Library")
                setSelected([])
                setRefetchTrigger((prev)=>!prev)
            })
        }catch(error){
            const err=error.response?.data?.message
            alert(err || "Failed to Delete Library");
            return
        }
    }
    async function removeSaved({libraryId,savedId}){
        try{
        await axios.put("http://localhost:5001/api/library/remove",
        {savedId,libraryId},
        {headers:{Authorization: `Bearer ${token}`}})
        setSaved((prev) => prev.filter((movie) => movie.id !== savedId));
        setRefetchTrigger((prev) => !prev);
        }catch(error){
        }
    }

    return (
        <section className="libContainer">
            <div className="libraries">
                <ul>
                {libraries && libraries.length > 0 ? (
            libraries.map((library) => (
              <li key={library._id} 
                onClick={()=>{
                setType("Add Library");
                setName("");
                setSelected([library])
              }} 
              className={`library ${selected[0]?._id==library._id?"selected":""}`}  >
              {library.name}</li>
            ))
          ) : (
            <p>No libraries found.</p>
          )}
                </ul>
                <div className="libActions">
                <form className="addLibraryForm" onSubmit={(e)=>submitHandler({e,type,name,selected,token,setName,setRefetchTrigger})}>
                <label htmlFor="name">Name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text"  id="name" name="name"/>
                <button>{type}</button>
                </form>
                    {type!=="Add Library"?<button onClick={()=>{setType("Add Library")}}>Add Library</button>:null}
                    {type!=="Rename"?<button onClick={()=>{setName(selected[0].name);setType("Rename")}}>Rename</button>:null}
                    <button onClick={()=>deleteLibrary()}>Remove Library</button>
                    <button>Share</button>
                    <button>Members</button>
                </div>
            </div>
            <div className="savedMovies">
                {saved.map((item) => (
                    <div className="movieWithRemove" key={item.id}>
                        <MovieCard movie={item} />
                        <button onClick={()=>removeSaved({libraryId:selected[0]?._id,savedId:item.id})} className="removeButton">Remove</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

