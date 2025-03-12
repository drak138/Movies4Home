import axios from "axios";
import { useState,useEffect } from "react"
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseSeasonHook({show_id,season}){
    const [seasonDetails,setSeasonDetails]=useState(null)
    useEffect(()=>{
        console.log("Fetching data for:", show_id, season);
        const fetchSeasonData=async()=>{
            const res=await axios.get(`https://api.themoviedb.org/3/tv/${show_id}/season/${season}`,{
            params:{
                api_key:TMDB_KEY
            }})
            setSeasonDetails(res.data)
        }
        if(show_id&&season) fetchSeasonData()
    },[show_id,season])
return{seasonDetails}
}