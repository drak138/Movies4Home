import { useState } from "react";
import ProfileOverview from "../components/profileOverview";
import ProfileSettings from "../components/profileSettings";

export default function Profile(){
    const [view,setView]=useState("overview")
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
            <ProfileOverview/>
            :
            <ProfileSettings/>
            }
        </section>
        </div>
    )
}