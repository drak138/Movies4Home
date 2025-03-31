import axios from "axios"
import { useEffect, useState } from "react"
import Message from "./messageBox"

export default function ProfileOverview({user,token}){
    const [commentsCount,setCommentsCount]=useState(0)
    useEffect(() => {
        const fetchCommentsCount = async () => {
            try {
                await axios.get(`https://movies4home.onrender.com/api/comments/getUserComments/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res)=>setCommentsCount(res.data.commentsCount))
            } catch (error) {
            }
        };
    
        fetchCommentsCount();
    }, [user]);
    return(
        <div className="overviewContainer">
            <div className="overview">
                <h2 className="userName">{user.username}</h2>
                <div className="contents">
                <p>Email:<span className="Email">{user.email}</span></p>
                <p>Comments:<span className="commentsCount">{commentsCount}</span></p>
                </div>
            </div>
        </div>
    )
}