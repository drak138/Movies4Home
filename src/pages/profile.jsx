import { useContext, useState } from "react";
import ProfileOverview from "../components/profileOverview";
import ProfileSettings from "../components/profileSettings";
import { AuthContext } from "../context/authContext";

export default function Profile(){
    const [view,setView]=useState("overview")
    const {user,token,logout}=useContext(AuthContext)
    return(
        <div className="profileWrapper">
        <section className="profileContainer">
            <section className="profileOverview">
                <button 
                onClick={e=>setView(e.target.value)} 
                value="overview" 
                className={view==="overview"? "selected":""}>
                    Overview
                </button>
                <button
                onClick={e=>setView(e.target.value)} 
                value="settings"
                className={view==="settings"? "selected":""}>
                    Settings
                </button>
            </section>
            {view==="overview"?
            <ProfileOverview user={user} token={token}/>
            :
            <ProfileSettings user={user} token={token} logout={logout}/>
            }
        </section>
        </div>
    )
}