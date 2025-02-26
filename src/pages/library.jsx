import { useEffect } from "react"
import MovieCard from "../components/movieCard"
import useListHook from "../hooks/useListHook"

export default function Library(){
    const{list}=useListHook({type:"tv",listModel:"Latest"})
    return(
        <section className="libContainer">
            <div className="libraries">
                <ul>
                    <li>Library1</li>
                    <li>Library2</li>
                    <li>Library3</li>
                </ul>
            </div>
            <div className="savedMovies">
                
                {/* forEach movie in library movie card 3 movies in a row three in a colum 3X3 */}
                {list?.result?.map((item)=>< MovieCard key={item.id} movie={item} />)}
            </div>
        </section>
    )

}