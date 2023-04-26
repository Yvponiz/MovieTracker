import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { CSSProperties, FunctionComponent, useEffect, useLayoutEffect, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useSearch } from "../context/searchContext";
import { Media } from "../models/media";
import { UserList } from "../models/user";
import AddButton from "./addButton";

type Props = {
    id: string | undefined
    isLoggedIn: boolean;
    lists: UserList[];
}

const PopularMovies: FunctionComponent<Props> = ({ isLoggedIn, id, lists }) => {
    const [trendingResult, setTrendingResult] = useState<Media[]>([]);
    const [clickedButton, setClickedButton] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { isLoading, setIsLoading } = useSearch();
    const carousel = useRef(null);

    useLayoutEffect(() => {
        setIsLoading(true);
        fetch(`/api/getPopular`)
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

    const PopularItems = trendingResult?.slice(0, 10).map((media: Media) => (
        <>
            {isMobile ? (
                <Link href={`/mediaInfo?id=${media.id}&media_type=${media.media_type}`} key={media.id}>
                    <div
                        className='popular-card'
                    >
                        <div className="popular-card-poster"
                            style={{ backgroundImage: isLoading ? `url(/icons/loading.svg)` : `url(https://www.themoviedb.org/t/p/original${media.poster_path})` }}
                        >
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

                    </div>
                </Link>
            ) : (
                <div
                    className='popular-card'
                >
                    <div className="popular-card-poster"
                        style={{ backgroundImage: isLoading ? `url(/icons/loading.svg)` : `url(https://www.themoviedb.org/t/p/original${media.poster_path})` }}
                    >
                        {isLoggedIn &&
                            <div
                                className={`popular-card-poster add-button${clickedButton === media.id ? " expanded-add-button" : ""}`}
                                onClick={(e) => handleButtonClick(e, media.id)}
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
                        <Link href={`/mediaInfo?id=${media.id}&media_type=${media.media_type}`}>
                            <h3>{media.original_title}</h3>
                        </Link>

                        <div className="media-year">
                            <p>{new Date(`${media.release_date}`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', })}</p>

                        </div>
                    </div>
                </div>
            )}
        </>
    ))

    const slidePrev = () => {
        // @ts-ignore: This error is intentionally ignored
        carousel.current && carousel.current.slidePrev();
    };

    const slideNext = () => {
        // @ts-ignore: This error is intentionally ignored
        carousel.current && carousel.current.slideNext();
    };



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
                    mouseTracking={isMobile}
                    animationDuration={800}
                    disableDotsControls
                    disableButtonsControls
                    autoWidth
                    animationType="fadeout"
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
        </div>
    )
}

export default PopularMovies;