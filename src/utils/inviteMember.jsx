import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Message from "../components/messageBox";

export default function InviteMember(){
    const {user,token}=useContext(AuthContext)
    const {inviteToken}=useParams()
    const [msg,setMessage]=useState("")
    const [error,setError]=useState(false)
    const navigate = useNavigate();
    useEffect(()=>{
        const addUser=async()=>{
            try{
                await axios.put("http://localhost:5001/api/library/invite",
                    {user,inviteToken},
                    {headers:{Authorization: `Bearer ${token}`}}
                ).then((res)=>{
                    navigate("/library")
                })
            }catch(error){
                if(error.response.data){
                setMessage(error.response.data)
                setError(true)
                setTimeout(()=>{
                    navigate("/")
                },5000)
                }
            }
        }
        if(user){
        addUser()
        }
    },[user])
    return(
        <div style={{alignItems:"center",
            display: "flex",
            height: "80%",
            justifyContent: "center"}}>
        <div style={{position:"relative"}}>
        {error?<Message message={msg} show={error} setShow={setError}/>:null}
        </div>
        </div>
    )
}