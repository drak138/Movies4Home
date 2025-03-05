import { useEffect, useState } from "react";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
export default function UseSearchHook({query,page}){
    const [search,setSearch]=useState(null)
    useEffect(()=>{
        const fetchData=async()=>{
            try{
            const res=await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&page=${page}&query=${query}`)
            const data=await res.json()
            const filteredResults = data.results?.filter(item => item.popularity >= 50) || [];

            setSearch({ ...data, results: filteredResults });
            }
            catch(error){
                console.log(error)
            }
        }
        fetchData()

    },[page,query])
    return{search}
}