import Image from "next/image";
import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Media } from "../models/media";
import { UserList } from "../models/user";
import { UserProps } from "../utils/commonProps";
import { MediaCardContext } from "./card";

type Props ={
    isLoggedIn: boolean;
    lists: UserList[];
}

const TrendingMovies: FunctionComponent<Props> = ({ isLoggedIn, lists }) => {
    const [trendingResult, setTrendingResult] = useState<Media[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
    const [mediaInfo, setMediaInfo] = useState<boolean>(false);
    const carousel = useRef(null);
    const { height, width, page } = useContext(MediaCardContext);
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;

    useEffect(() => {
        fetch(`/api/getTrending`)
            .then(response => response.json())
            .then(data => {
                setTrendingResult(data.results);
            });
    }, [])

    const handleInfoClick = (mediaId: number) => {
        if (selectedMovieId === mediaId) {
            setMediaInfo(!mediaInfo);
        } else {
            setSelectedMovieId(mediaId);
            setMediaInfo(true);
        }
    };

    const TrendingItems = trendingResult?.slice(0, 5).map((media: Media) => (
        <div
            key={media.id}
            className='trending-card'
            style={{ backgroundImage: `url(https://www.themoviedb.org/t/p/original${media.poster_path})` }}
        >
            <div className="trending-card-content">
                <Image className="info-icon"
                    src='icons/info.svg'
                    width={30}
                    height={30}
                    alt='summary icon'
                    onClick={(e) => { handleInfoClick(media.id) }}
                />

                <div className="trending-card-content-bottom">
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
            <AliceCarousel
                ref={carousel}
                items={TrendingItems}
                responsive={responsive}
                mouseTracking
                animationDuration={800}
                disableDotsControls
                paddingLeft={10}
                paddingRight={70}
                autoWidth
                controlsStrategy="alternate"
                animationType="fadeout"
                // autoPlay
                autoPlayStrategy="none"
                autoPlayInterval={5000}
            />
        </div>
    )
}

export default TrendingMovies;