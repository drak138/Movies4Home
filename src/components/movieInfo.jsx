import { useEffect, useState } from "react"
import useImagesHook from "../hooks/useImagesHook"
import StarRating from "./starRating"

export default function MovieInfo({details,id,title,mediaType}){
    const {images}=useImagesHook({mediaType:mediaType,movieId:id})
    const [genres,setGenres]=useState([])
    useEffect(() => {
        if (details?.genres) {
            const newGenres = details.genres.flatMap(genre => genre.name.split("&"));
            setGenres(prev => [...prev, ...newGenres]);
        }
    }, [details?.genres]); // Add `details` as the dependency array
    console.log(genres);
    
    return(
        <section className="infoContainer">
            <img style={{width:"20rem"}} src={`https://image.tmdb.org/t/p/original/${images?.logos.filter(iso=>iso.iso_639_1=="en")[0].file_path}`} alt={title} />
            <section className="infoWrapper">
                <img style={{width:"15rem"}} src={`https://image.tmdb.org/t/p/w780${details?.poster_path}`} alt="" />
                <div className="additionalInfo">
                    <h3>{mediaType=="movie"?details?.title:details?.name}</h3>
                    <p>{details?.overview}</p>
                    {details && <StarRating rating={details.vote_average} />}
                    <div className="moreInfo">
                    <p>{mediaType=="movie"?"Year:":"Year Started:"} <span>{`${mediaType=="movie"?details?.release_date:details?.first_air_date}`.split("-")[0]}</span></p>
                    <p>Country Origin:<span>
    {
      {
        US: " United States",
        GB: " United Kingdom",
        DE: " Germany",
        FR: " France",
        IT: " Italy",
        IN: " India"
        // Add more mappings here as needed
      }[details?.origin_country] || details?.origin_country
    }
  </span>
                    </p>
                    <p>Original Language: <span>{
      {
        en: "English",
        de: "German",
        fr: "French",
        it: "Italian",
        es: "Spanish",
        ta: "Tamil"
        // Add more mappings here as needed
}[details?.original_language] || details?.original_language}</span>
                    </p>
                    {mediaType=="movie"?null:<p>Show Status: <span>{details?.status}</span></p>}
                    <p>Genres: {genres.join(" | ")}</p>
                </div>
                </div>
            </section>

        </section>
    )
}