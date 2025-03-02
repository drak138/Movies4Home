import MoviePlayer from "../components/moviePlayer";

export default function Movie(){
    return(
        <div className="playerWrapper">
        <section className="movieDetails">
            <MoviePlayer/>
        </section>
        {/* <SimilarMovies/> */}
        </div>
    )
}