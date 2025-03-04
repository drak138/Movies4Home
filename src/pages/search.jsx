import { useParams } from "react-router-dom"
import UseSearchHook from "../hooks/useSearchHook"
import Pagination from "../components/pagination"
import MovieCard from "../components/movieCard"

export default function Search(){
    const {query,page}=useParams()
    const {search}=UseSearchHook({query:query,page:page})
    console.log(search)
    return(
        <section className="searchWrapper">
            <Pagination query={query} currentPage={page} totalPages={search?.total_pages}/>
            <div className="results">
            {search?.results.map((item)=>(
             <MovieCard key={item.id} movie={item} />
            ))}
            </div>
        </section>
    )
}