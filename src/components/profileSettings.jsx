import { useState } from "react"
import Changes from "./changes"

export default function ProfileSettings({user,token}){
    const [change,setChange]=useState("")
    return(
        <div className="settingsContainer">
            <ul className="settingWrapper">
                <li onClick={(e=>setChange("Change user name"))} className="changeName settings">Change user name</li>
                <li onClick={(e=>setChange("Change password"))} className="changePass settings">Change password</li>
                <li className="deleteProfile settings">Delete Profile</li>
                {change!==""?<Changes type={change}/>:<></>}
            </ul>
        </div>
    )
}