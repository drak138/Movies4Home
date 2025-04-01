import { useContext,useEffect,useMemo, useState} from "react"
import MovieCard from "../components/movieCard"
import axios from "axios";
import { AuthContext } from "../context/authContext";
import UseLibrariesHook from "../hooks/useLibrariesHook";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function submitHandler({e, name, selected, token, setName, setRefetchTrigger, type,action}) {
    e.preventDefault();
    try {
        const body={name,action}
        if(selected){
            body.libraryId=selected[0]._id
        }
        const command = type === "Add Library" ? axios.post : axios.put;
        await command("https://movies4home.onrender.com/api/library",
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
    const [showLib,setShowLib]=useState(true)
    const [selectedMember,setSelectedMember]=useState([])
    const [toggleRole,setToggleRole]=useState([])
    const [selectedRole, setSelectedRole] = useState("");
    const [copyText, setCopyText] = useState(null);
    const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
};
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
                const matchedLibrary = libraries.find((library) => library._id == prev[0]?._id);
                return [matchedLibrary] || prev;
                })
            }
        }
      }, [libraries,refetchTrigger]);

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
    
    }, [selected,refetchTrigger]);

    const userRole=useMemo(()=>{
        if(selected[0]?.userId==user._id){
            return "owner"
        }else{
            return selected[0]?.members.find(member => member.username === user.username)?.role;
        }
    },[selected,refetchTrigger])

    const [members,setMembers]=useState(useEffect(()=>
        setMembers(selected[0]?.members),[selected]))
    async function leaveLibrary({memberId,user,action}) {
        try{
            await axios.put("https://movies4home.onrender.com/api/library/leave",
                {libraryId:selected[0]?._id,memberId,user,action},
                {headers:{Authorization: `Bearer ${token}`}}
            ).then((res)=>{
                if(action=="remove Member"){
                setSelectedMember([])
            }
            else{
                setName("")
                setType("Add Library")
                setSelected([])
            }
                setRefetchTrigger((prev)=>!prev)
            })
        }catch(error){
            const err=error.response?.data?.message
            alert(err || "Failed to Delete Library");
            return
        }
    }
    async function shareLibrary(e){
        try{
            const { clientX, clientY } = e
            await axios.post("https://movies4home.onrender.com/api/library/invite",
            {libraryId:selected[0]?._id,userId:user._id,action:"share"},
            {headers:{Authorization: `Bearer ${token}`}}).then((res)=>{
                navigator.clipboard.writeText(res.data);
                setCopyText({ text: "Link created and copied!", x: clientX, y: clientY });
                setTimeout(() => setCopyText(null), 2500);
            })
        }
        catch(error){
            const err=error.response?.data?.message
            alert(err || "Failed to Create Link");
            return
        }
    }


    async function deleteLibrary() {
        try{
            await axios.delete("https://movies4home.onrender.com/api/library",{
            data: { libraryId: selected[0]._id,action:"delete" },
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
    async function removeSaved({libraryId,savedId,action}){
        try{
        await axios.put("https://movies4home.onrender.com/api/library/remove",
        {savedId,libraryId,action},
        {headers:{Authorization: `Bearer ${token}`}})
        setSaved((prev) => prev.filter((movie) => movie.id !== savedId));
        setRefetchTrigger((prev) => !prev);
        }catch(error){
            const err=error.response?.data?.message
            alert(err || "Failed to Delete Library");
            return
        }
    }
    async function changeRole(){
        const role=selectedRole
        const libraryId=selected[0]._id
        const memberId=selectedMember[0]._id
        try{
            await axios.put("https://movies4home.onrender.com/api/library/changeRole",
                {role,libraryId,memberId,action:"change role"},
                {headers: {Authorization: `Bearer: ${token}`}}
            ).then((res)=>{
                setSelectedMember([{ ...selectedMember[0], role }]);
                setRefetchTrigger(prev=>!prev)
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
                {showLib?
                <>
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
          )}</>
          :<>
          {members && members.length>0?(
            members.map((member)=>(
                <div key={member._id}>
                <li
                disabled={member.username==user.username}
                onClick={()=>{
                if(member.username!==user.username){
                setSelectedMember([member])
                setSelectedRole(member.role)
                };
                setToggleRole([])
              }} 
              className={`member ${selectedMember? selectedMember[0]?._id==member._id?"selected":"":""}`}  >
              {member.username}-{member.role}
              </li>
              {toggleRole.includes(member.username)&&(
              <div className="roleHolder ">
              <label className="role" htmlFor="member Role"><input type="radio" disabled={selectedRole === "co-owner"} checked={selectedRole === "co-owner"} onChange={handleRoleChange} name="role" id={selectedMember[0]?._id} value="co-owner"/>co-owner</label>
              <label className="role" htmlFor="member Role"><input type="radio" disabled={selectedRole === "editor"} checked={selectedRole === "editor"} onChange={handleRoleChange} name="role" id={selectedMember[0]?._id} value="editor"/>editor</label>
              <label className="role" htmlFor="member Role"><input type="radio" disabled={selectedRole === "viewer"} checked={selectedRole === "viewer"} onChange={handleRoleChange} name="role" id={selectedMember[0]?._id} value="viewer"/>viewer</label>
              <div className="flex-row">
              {selectedRole!==selectedMember[0].role&&(<button onClick={()=>changeRole()}>Confirm change</button>)}
              <button onClick={()=>setToggleRole([])}>Cancel</button>
              </div>
              </div>
              )}
              </div>
            ))
        ):
          (<p>No Members found.</p>)}</>}
                </ul>
                <div className="libActions">
                {showLib?
                <>
                <form className="addLibraryForm" onSubmit={(e)=>submitHandler({e,type,name,selected,token,setName,setRefetchTrigger,action:type=="Add Library"?"add library":"rename"})}>
                <label htmlFor="name">Name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text"  id="name" name="name"/>
                <button>{type}</button>
                </form>
                    {type!=="Add Library"?<button onClick={()=>{setType("Add Library");setName("")}}>Add Library</button>:null}
                    {type!=="Rename"?<button onClick={()=>{setName(selected[0].name);setType("Rename")}}>Rename</button>:null}
                    <button onClick={()=>deleteLibrary()}>Remove Library</button>
                    <button onClick={()=>leaveLibrary({user:user,action:"leave"})}>Leave library</button>
                    <button onClick={()=>setShowLib(false)}>Members</button>
                    <button onClick={shareLibrary}>Share</button>
                    {copyText && (
                    <div
                    className="tooltip"
                    >
                    {copyText.text}
                    </div>
                )}
                </>
                :<>
                {selectedMember.length > 0 ? (
                (userRole === "co-owner" && userRole !== selectedMember[0]?.role) || userRole === "owner" ? (
                <>
                <button onClick={() =>leaveLibrary({ memberId: selectedMember[0]._id, action: "remove Member" })}>Remove Member</button>
                <button onClick={() =>setToggleRole(selectedMember[0].username)}>Change Role</button>
                </>
                ) : (
                <p>Can't edit users with higher or the same role as you</p>
                )) : 
                (
                <p>Need to select a Member</p>
                )}
                <button onClick={()=>{setShowLib(true);setSelectedMember([]);setToggleRole([])}}>Library</button>
                </>
                }
                </div>
            </div>
            <div className="savedMovies">
                {saved.map((item) => (
                    <div className="movieWithRemove" key={item.id}>
                        <MovieCard movie={item} />
                        <button onClick={()=>removeSaved({libraryId:selected[0]?._id,savedId:item.id,action:"remove"})} className="removeButton">Remove</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

