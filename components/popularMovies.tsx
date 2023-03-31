import Image from "next/image";
import router from "next/router";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useSearch } from "../context/searchContext";
import { Media } from "../models/media";
import { UserList } from "../models/user";

type Props = {
    isLoggedIn: boolean;
    lists: UserList[];
}

const PopularMovies: FunctionComponent<Props> = ({ isLoggedIn, lists }) => {
    const [trendingResult, setTrendingResult] = useState<Media[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
    const [mediaInfo, setMediaInfo] = useState<boolean>(false);
    const { isLoading, setIsLoading } = useSearch();
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;
    const carousel = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/getPopular`)
            .then(response => response.json())
            .then(data => {
                setTrendingResult(data.results);
                setIsLoading(false);
            });
    }, [])

    const handleInfoMouseEnter = (mediaId: number) => {
        setSelectedMovieId(mediaId);
        setMediaInfo(true);
    };

    const handleInfoMouseLeave = () => {
        setMediaInfo(false);
    };

    const handleCardClick = (id: number) => {
        router.push(`/mediaInfo?id=${id}`);
    }

    const PopularItems = trendingResult?.slice(0, 10).map((media: Media) => (
        <div
            key={media.id}
            className='popular-card'
            onClick={() => handleCardClick(media.id)}
        >
            <div className="popular-card-poster"
                style={{ backgroundImage: isLoading ? `url(/icons/loading.svg)` : `url(https://www.themoviedb.org/t/p/original${media.poster_path})` }}
            >
                {isLoggedIn && <div className="add-button">
                    <Image
                        src='/icons/add-icon.svg'
                        width={30}
                        height={30}
                        alt='add icon'
                    />
                </div>}

                <div className="media-score">
                    <Image
                        src='/icons/imdb-logo.svg'
                        height={30}
                        width={40}
                        alt='imdb logo'
                    />
                    <p>{media.vote_average?.toPrecision(2)}</p>
                </div>
            </div>

            <div className="popular-card-content-bottom">
                <h3>{media.original_title}</h3>

                <div className="media-year">
                    <p>{new Date(`${media.release_date}`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', })}</p>

                </div>
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
        <div className="popular-div">
            <h2>What&apos;s Popular </h2>
            <div className="popular-carousel">
                <AliceCarousel
                    ref={carousel}
                    items={PopularItems}
                    responsive={responsive}
                    mouseTracking
                    animationDuration={800}
                    disableDotsControls
                    disableButtonsControls={isMobile}
                    autoWidth
                    animationType="fadeout"
                    infinite
                />
            </div>
        </div>
    )
}

export default PopularMovies;