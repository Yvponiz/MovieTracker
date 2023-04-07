import Image from "next/image";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useSearch } from "../context/searchContext";
import { Media } from "../models/media";
import { UserList } from "../models/user";
import router from "next/router";
import AddButton from "./addButton";
import Link from "next/link";

type Props = {
    id: string | undefined;
    isLoggedIn: boolean;
    lists: UserList[];
}

const TrendingMovies: FunctionComponent<Props> = ({ isLoggedIn, id, lists }) => {
    const [trendingResult, setTrendingResult] = useState<Media[]>([]);
    const [clickedButton, setClickedButton] = useState<number | null>(null);
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
    }, [setIsLoading])

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

    const handleButtonClick = (e: React.MouseEvent, mediaId: number) => {
        e.stopPropagation();
        setClickedButton((prevClickedButton) => (prevClickedButton === mediaId ? null : mediaId));
    };

    const slidePrev = () => {
        // @ts-ignore: This error is intentionally ignored
        carousel.current && carousel.current.slidePrev();
    };

    const slideNext = () => {
        // @ts-ignore: This error is intentionally ignored
        carousel.current && carousel.current.slideNext();
    };

    const TrendingItems = trendingResult?.slice(0, 10).map((media: Media) => (
        <>
            {isMobile ?
                <Link href={`/mediaInfo?id=${media.id}`} key={media.id}>
                    <div
                        key={media.id}
                        className='trending-card'
                        style={{ backgroundImage: isLoading ? `url(/icons/loading.svg)` : `url(https://www.themoviedb.org/t/p/original${media.poster_path})` }}
                    >
                        <div className="trending-card-content">
                            <div className="trending-card-content-left">
                                <Link href={`/mediaInfo?id=${media.id}&media_type=${media.media_type}`}>
                                    {media.media_type === "movie" ? <h3>{media.title}</h3> : <h3>{media.name}</h3>}
                                </Link>

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
                        </div>
                    </div>
                </Link>
                :
                <div
                    key={media.id}
                    className='trending-card'
                    style={{ backgroundImage: isLoading ? `url(/icons/loading.svg)` : `url(https://www.themoviedb.org/t/p/original${media.poster_path})` }}
                >
                    <div className="trending-card-content">
                        <div className="trending-card-content-left">
                            <Link href={`/mediaInfo?id=${media.id}&media_type=${media.media_type}`}>
                                {media.media_type === "movie" ? <h3>{media.title}</h3> : <h3>{media.name}</h3>}
                            </Link>


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

                        {isLoggedIn &&
                            <div
                                className={`trending-card-content add-button${clickedButton === media.id ? " expanded-add-button" : ""}`}
                                onClick={(e) => { handleButtonClick(e, media.id) }}
                            >
                                <AddButton
                                    id={id}
                                    media={media}
                                    imgHeight={30}
                                    imgWidth={30}
                                    lists={lists}
                                    clickedButton={clickedButton}
                                />
                            </div>
                        }
                    </div>
                </div>
            }
        </>
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
                disableButtonsControls
                paddingLeft={10}
                paddingRight={70}
                autoWidth
                animationType="fadeout"
                autoPlay
                autoPlayInterval={2000}
                infinite
            />

            <div className="arrow-div">
                <div className="arrow" onClick={slidePrev}>
                    <Image
                        src={"/icons/arrow-left.svg"}
                        height={20}
                        width={20}
                        alt={"left arrow"}
                    />
                </div>

                <div className="arrow" onClick={slideNext}>
                    <Image
                        src={"/icons/arrow-right.svg"}
                        height={20}
                        width={20}
                        alt={"right arrow"}
                    />
                </div>
            </div>
        </div>
    )
}

export default TrendingMovies;