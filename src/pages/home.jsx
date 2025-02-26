import MovieCouracel from "../components/movieCouracel";
import MovieList from "../components/movieList";

export default function Home(){
    return(
        <>
        <MovieCouracel/>
        <div className="movieLists">
        <MovieList listType={"Trending"}/>
        <MovieList listType={"Latest"}/>
        <MovieList listType={"Top Rated"}/>
        </div>
        </>
    )
}