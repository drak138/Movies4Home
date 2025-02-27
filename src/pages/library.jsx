import { useEffect } from "react"
import MovieCard from "../components/movieCard"
import useListHook from "../hooks/useListHook"

export default function Library(){
    const { list } = useListHook({ type: "tv", listModel: "Latest" });

    return (
        <section className="libContainer">
            <div className="libraries">
                <ul>
                    <li className="selected">Library1</li>
                    <li>Library2</li>
                    <li>Library3</li>
                </ul>
                <div className="libActions">
                    <button>Add Library</button>
                    <button>Rename</button>
                    <button>Remove Library</button>
                </div>
            </div>
            <div className="savedMovies">
                {list?.results?.map((item) => (
                    <div className="movieWithRemove" key={item.id}>
                        <MovieCard movie={item} />
                        <button className="removeButton">Remove</button>
                    </div>
                ))}
            </div>
        </section>
    );
}
