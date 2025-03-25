import { useContext,useEffect, useState } from "react"
import MovieCard from "../components/movieCard"
import useListHook from "../hooks/useListHook"
import axios from "axios";
import { AuthContext } from "../context/authContext";
import UseLibrariesHook from "../hooks/useLibrariesHook";

export default function Library(){
    const{token,user}=useContext(AuthContext)
    const { list } = useListHook({ type: "tv", listModel: "Latest" });
    const [name,setName]=useState("")
    const [refetchTrigger, setRefetchTrigger] = useState(false);
    const { libraries } = UseLibrariesHook({
        token,
        userId: user?._id,
        username: user?.username,
        refetchTrigger
      });
      const [selected, setSelected] = useState([]);
      useEffect(() => {
        if (libraries.length > 0) {
          setSelected(libraries.filter((library) => library.type === "liked")[0]._id);
        }
      }, [libraries]);
      console.log(selected)
    async function addLibrary(e){
        e.preventDefault()
        try{
            await axios.post("http://localhost:5001/api/library",
            {name},
            {headers:{Authorization: `Bearer ${token}`}}).then(()=>{
                setName("");
                setRefetchTrigger((prev)=>!prev)
            })
        }catch(error){
            const err=error.response?.data?.message
            alert(err || "Failed to create library");
            return
        }
    }
    return (
        <section className="libContainer">
            <div className="libraries">
                <ul>
                {libraries && libraries.length > 0 ? (
            libraries.map((library) => (
              <li onClick={()=>setSelected(library._id)} className={`library ${selected.includes(library._id)?"selected":""}`}  key={library._id}>{library.name}</li>
            ))
          ) : (
            <p>No libraries found.</p>
          )}
                </ul>
                <div className="libActions">
                <form className="addLibraryForm" onSubmit={addLibrary}>
                <label htmlFor="name">Name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text"  id="name" name="name"/>
                <button>Add Library</button>
                </form>
                    <button>Rename</button>
                    <button>Remove Library</button>
                    <button>Share</button>
                    <button>Members</button>
                </div>
            </div>
            <div className="savedMovies">
                {list?.results?.map((item) => (
                    <div className="movieWithRemove" key={item.id}>
                        <MovieCard movie={item} />
                        <button className="removeButton">Remove</button>
                    </div>
                ))}
            </div>
        </section>
    );
}
