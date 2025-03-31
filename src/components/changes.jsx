import { useContext,useEffect,useState } from "react"
import { AuthContext } from "../context/authContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Changes({type}){
    const{user,token,logout}=useContext(AuthContext)
    const [username,setUsername]=useState(user.username)
    const [password,setPassword]=useState("")
    const [oldPass,setOldPass]=useState("")
    const [error,setError]=useState(false)
    const navigate=useNavigate()
    async function submitHandler(e){
        e.preventDefault()
        if(type=="Change user name"){
            try{
            await axios.put(`https://movies4home.onrender.com/api/profile/${user._id}`,
            {username:username},
            {headers:{ Authorization: `Bearer ${token}` }
        }).then(()=>{window.location.reload()})
        }catch(error){
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
        }
        else{
            try{
            await axios.put(`https://movies4home.onrender.com/api/profile/${user._id}`,
            {password:password,oldPass:oldPass},
            {headers:{Authorization: `Bearer ${token}`}
        }).then(()=>{logout();navigate("/signup")})
    }catch(error){
        if (error.response && error.response.data.message) {
            setError(error.response.data.message);
        }
    }
        }
    }
    useEffect(()=>{
       if(type=="Change user name"){
        if(username==user.username){
            setError(true)
        }
        else if(username.trim().length<5){
            setError(true)
        }
        else{
            setError(false)
        }
        }
        else if(type=="Change password"){
            if(password.trim().length<8){
                setError(true)
            }
            else{
                setError(false)
            }
        }
        else{
            setError(false)
        }
    },[username,type,password,oldPass])
    return(
        <div className="change">
            <form onSubmit={submitHandler} className="changeForm">
                {
                type=="Change user name"?
                <>
                <label htmlFor="userName">New User name
                    <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" id="userName" name="username"/>
                </label>
                {username==user.username&&(<p className="error">Username must be different</p>)}
                {error&&(<p className="error">{error}</p>)}
                {username.trim().length<5&&(<p className="error">Username must be at least 5 Characters</p>)}
                </>:
                <>
                <label htmlFor="oldPass">Old Password
                <input value={oldPass} onChange={(e)=>setOldPass(e.target.value)} type="password" id="oldPass" name="oldPass"/>
                </label>
                {error&&(<p className="error">{error}</p>)}
                <label htmlFor="newPass">New Password
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" id="newPass" name="password"/>
                </label>
                {password.trim().length<8&&(<p className="error">Password must be at least 8 Characters</p>)}
                </>
                }
                <button style={{color:error?"gray":"orange"}} disabled={error}>{type}</button>
            </form>
        </div>
    )
}