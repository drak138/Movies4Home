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
    const [type,setType]=useState("Add Library")
    const { libraries } = UseLibrariesHook({
        token,
        userId: user?._id,
        username: user?.username,
        refetchTrigger
      });
      const [selected, setSelected] = useState([]);
      useEffect(() => {
        if (libraries.length > 0 && selected.length==0) {
          setSelected(libraries.filter((library) => library.type === "liked"));
        }
      }, [libraries]);

    async function submitHandler(e){
        e.preventDefault()
        try{
            const command=type==="Add Library"?axios.post:axios.put
            await command("http://localhost:5001/api/library",
            {name,libraryId:selected[0]._id},
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

    return (
        <section className="libContainer">
            <div className="libraries">
                <ul>
                {libraries && libraries.length > 0 ? (
            libraries.map((library) => (
              <li onClick={()=>{
                setType("Add Library");
                setName("");
                setSelected([library])
              }} 
              className={`library ${selected[0]?._id==library._id?"selected":""}`}  
              key={library._id}>
              {library.name}</li>
            ))
          ) : (
            <p>No libraries found.</p>
          )}
                </ul>
                <div className="libActions">
                <form className="addLibraryForm" onSubmit={submitHandler}>
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
