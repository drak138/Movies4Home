import { useState } from "react"
import Changes from "./changes"
import Message from "./messageBox"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function ProfileSettings({user,token,logout}){
    const [change,setChange]=useState("")
    const [showMsg, setShowMsg]=useState(false)
    const navigate=useNavigate()
    const deleteUser=async()=>{
        try{
            await axios.delete(`http://localhost:5001/api/profile/${user._id}`,
            {headers:{Authorization: `Bearer ${token}`}}).then(()=>{logout();navigate("/")})
        }catch(error){

        }
    }
    return(
        <div className="settingsContainer">
            <ul className="settingWrapper">
                <li onClick={(e=>setChange("Change user name"))} className="changeName settings">Change user name</li>
                <li onClick={(e=>setChange("Change password"))} className="changePass settings">Change password</li>
                <button onClick={()=>setShowMsg(true)} className="deleteProfile settings">Delete Profile</button>
                {change!==""?<Changes type={change}/>:<></>}
                {showMsg?<Message message="Are you sure you want to delete your Profile!" func={deleteUser}show={showMsg}setShow={setShowMsg}/>:null}
            </ul>
            
        </div>
    )
}