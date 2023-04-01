import Image from "next/image";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useSearch } from "../context/searchContext";
import { Media } from "../models/media";
import { UserList } from "../models/user";
import router from "next/router";

type Props = {
    isLoggedIn: boolean;
    lists: UserList[];
}

const TrendingMovies: FunctionComponent<Props> = ({ isLoggedIn, lists }) => {
    const [trendingResult, setTrendingResult] = useState<Media[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
    const [mediaInfo, setMediaInfo] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { isLoading, setIsLoading } = useSearch();
    const carousel = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/getTrending`)
            .then(response => response.json())
            .then(data => {
                setTrendingResult(data.results);
                setIsLoading(false);
            });
    }, [])

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 500);
        };
        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    const handleCardClick = (id: number) => {
        router.push(`/mediaInfo?id=${id}`);
    }

    const TrendingItems = trendingResult?.slice(0, 10).map((media: Media) => (
        <div
            key={media.id}
            className='trending-card'
            style={{ backgroundImage: isLoading ? `url(/icons/loading.svg)` : `url(https://www.themoviedb.org/t/p/original${media.poster_path})` }}
            onClick={() => handleCardClick(media.id)}
        >
            <div className="trending-card-content">
                <div className="trending-card-content-left">
                    {media.media_type === "movie" ? <h3>{media.title}</h3> : <h3>{media.name}</h3>}

                    <div className="media-year">
                        {media.media_type === "movie" ?
                            <p>{new Date(`${media.release_date}`).getFullYear()}</p>
                            : <p>{new Date(`${media.first_air_date}`).getFullYear()}</p>
                        }
                    </div>

                    <div className="media-score">
                        <Image
                            src='/icons/imdb-logo.svg'
                            height={30}
                            width={40}
                            alt='imdb logo'
                        />
                        <p>{media.vote_average?.toPrecision(2)} rating</p>
                    </div>
                </div>
                {isLoggedIn && <div className="add-button">
                    <Image
                        src='/icons/add-icon.svg'
                        width={30}
                        height={30}
                        alt='add icon'
                    />
                </div>}
            </div>

            {mediaInfo && selectedMovieId === media.id && (
                <div className="info-text">
                    {media.overview ? <p>{media.overview}</p> : <p>{`Aye man, I couldn't find no summary`}</p>}
                </div>
            )}

        </div>
    ))

    const responsive = {
        0: { items: 1 },
        568: { items: 3 },
        1024: { items: 4 },
    };

    return (
        <div className="trending-carousel">
            <h2>Trending movies & series</h2>
            <AliceCarousel
                ref={carousel}
                items={TrendingItems}
                responsive={responsive}
                mouseTracking={isMobile}
                animationDuration={800}
                disableDotsControls
                disableButtonsControls={isMobile}
                paddingLeft={10}
                paddingRight={70}
                autoWidth
                animationType="fadeout"
                autoPlay
                autoPlayInterval={2000}
            />
        </div>
    )
}

export default TrendingMovies;