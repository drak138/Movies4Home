import UseSimilarHook from "../hooks/useSimilarHook"
import MovieCard from "./movieCard";

export default function Similar({mediaType,details}){
    const genres = details?.genres?.slice(0, 3).map(genre => genre.id).join(",") || "";
    const { similar } = UseSimilarHook({ mediaType, genres, id: details?.id });
    return(
        similar.map(item=><MovieCard key={item.id} movie={item}/>)
    )
}