import { useParams } from "react-router-dom"
import UseSearchHook from "../hooks/useSearchHook"
import Pagination from "../components/pagination"
import MovieCard from "../components/movieCard"

export default function Search(){
    const {query,page}=useParams()
    const pageNum=Number(page)
    const {search,loading}=UseSearchHook({query:query,page:page})
    const currentPageData = search ? search[pageNum - 1] : [];


    return(
        <section className="searchWrapper">
            {loading?<p style={{justifySelf:"center"}}>Loading...</p>:
            <>
            <Pagination query={query} currentPage={page} totalPages={search?.length}/>
            <div className="results">
            {
            (
            currentPageData?.map((item)=>(
             <MovieCard key={item.id} movie={item} />
            )))
            }
            </div>
            </>
        }

        </section>
    )
}