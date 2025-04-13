import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function TvSeasons({ details, id,sectionRef,openSeasons,toggleSeason }) {
    const seasons = details?.number_of_seasons;
    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        if (!details?.id || !seasons) return;

        const fetchEpisodes = async () => {
            try {
                const allEpisodes = [];
                for (let i = 1; i <= seasons; i++) {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${TMDB_KEY}`
                    );
                    const data = await response.json();
                    
                    if (data.episodes && data.episodes.length > 0) {
                        allEpisodes.push({
                            season: i,
                            episodes: data.episodes, // Store only non-empty seasons
                        });
                    }
                }
                setEpisodes(allEpisodes);
            } catch (error) {
                console.error("Error fetching episodes:", error);
            }
        };

        fetchEpisodes();
    }, [details, seasons]);


    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    return (
        <div className="seasonsContainer">
            {episodes.map(({ season, episodes }) => (
                <div key={season} ref={(el) => (sectionRef.current[season] = el)}>
                    <h3 className="seasonNumber" onClick={() => toggleSeason(season)}>
                        Season {season} {openSeasons.includes(season) 
                            ? <i className="fa-solid fa-sort-up"></i> 
                            : <i className="fa-solid fa-sort-down"></i>}
                    </h3>
                    <ul className={`episodes custom-scroll ${openSeasons.includes(season) ? "show" : ""}`}>
                        {episodes.map(ep => {
                            const isReleased = ep.air_date && ep.air_date <= today;

                            return isReleased ? (
                                <Link 
                                    className="episode" 
                                    to={`/watch/tv/${details.name}/${details.id}/season/${season}/episode/${ep.episode_number}`} 
                                    key={ep.id}
                                >
                                    <span>Episode {ep.episode_number}.{ep.air_date} - </span>{ep.name} - {ep.runtime} min
                                </Link>
                            ) : (
                                <p className="episode" key={ep.id}>
                                    <span>Episode {ep.episode_number}.{ep.air_date} - </span>{ep.name} (Coming Soon)
                                </p>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}


