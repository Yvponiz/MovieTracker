import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Media } from "../models/media";
import MediaCard, { MediaCardContext, MediaCardProps } from "./card";


const TrendingMovies: FunctionComponent = () => {
    const [trendingResult, setTrendingResult] = useState<Media[]>([]);

    const { height, width, page } = useContext(MediaCardContext);
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;

    useEffect(() => {
        fetch(`/api/getTrending`)
            .then(response => response.json())
            .then(data => {
                setTrendingResult(data.results);
            });
    })
    return (
        <div>
            {trendingResult?.slice(0, 1).map((media: Media) => (

                <div
                    className="trending-card" key={media.id}
                    style={{backgroundImage: `url(https://www.themoviedb.org/t/p/original${media.poster_path})`}}
                >
                    
                </div>

            ))}
        </div>
    )
}

export default TrendingMovies;