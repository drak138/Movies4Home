import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UseSeasonHook from "../hooks/useSeasonHook";

export default function SeriesActions({ season, episode, lastEpisode, title }) {
    const { episode_number, season_number, show_id } = lastEpisode;
    
    const { seasonDetails } = UseSeasonHook({ show_id, season: Number(season) });
    const { seasonDetails: prevSeasonDetails } = UseSeasonHook({ show_id, season: Number(season) - 1 });

    const [prevEpisode, setPrevEpisode] = useState(episode);
    const [prevSeason, setPrevSeason] = useState(season);
    const [nextEpisode, setNextEpisode] = useState(episode);
    const [nextSeason, setNextSeason] = useState(season);

    useEffect(() => {
        if (!seasonDetails) return;
        // Next episode
        if (season < season_number) {
            if (episode == seasonDetails?.episodes?.length) {
                setNextEpisode(1);
                setNextSeason(Number(season) + 1);
            } else if (episode < seasonDetails?.episodes?.length) {
                setNextSeason(season)
                setNextEpisode(Number(episode) + 1);
            }
        }

        // Previous episode
        if (episode > 1 && season >= 1) {
            setPrevSeason(season)
            setPrevEpisode(Number(episode) - 1);
        } else if (episode == 1 && season > 1) {
            setPrevSeason(Number(season) - 1);
            const prevSeasonEpisode = prevSeasonDetails?.episodes?.length || 1;
            setPrevEpisode(prevSeasonEpisode);
        }
        //Last season episode controller
        if(season==season_number&&episode<episode_number){
            setNextEpisode(Number(episode)+1)
        }

    }, [season, episode, seasonDetails, prevSeasonDetails]);

    return (
        <section className="seriesActionsHolder">
            <Link
            className="seriesAction"
                to={`/watch/tv/${title}/${show_id}/season/${prevSeason}/episode/${prevEpisode}`}
                style={{ pointerEvents: !(season == 1 && episode == 1) ? "auto" : "none", opacity: !(season == 1 && episode == 1) ? 1 : 0.5 }}
            >
                Prev
            </Link>
            <button className="seriesAction" >Episodes</button>
            <Link className="seriesAction" to={`/watch/tv/${title}/${show_id}/season/${nextSeason}/episode/${nextEpisode}`}
            style={{ pointerEvents: !(season == season_number && episode == episode_number) ? "auto" : "none", opacity: !(season == season_number && episode == episode_number) ? 1 : 0.5 }}

            >Next</Link>
        </section>
    );
}




