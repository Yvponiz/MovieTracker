import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { FunctionComponent, useEffect, useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { MediaPage } from "../models/mediaPage";
import { SearchProvider, useSearch } from "../context/searchContext";
import Image from "next/image";
import { Credits, Media } from "../models/media";
import AddButton from "../components/addButton";
import commonProps, { UserProps } from "../utils/commonProps";
import { UserList } from "../models/user";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

type MediaProps = MediaPage & UserProps;

const MediaInfo: FunctionComponent<MediaProps> = ({ id, isLoggedIn, userType }) => {
    const [media, setMedia] = useState<MediaPage>()
    const [credits, setCredits] = useState<Credits>();
    const [lists, setLists] = useState<UserList[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [clickedButton, setClickedButton] = useState<number | null>(null);
    const { isLoading, setIsLoading } = useSearch();
    const router = useRouter();
    const mediaId = router.query.id;
    const mediaType = router.query.media_type;


    const fetchLists = () => {
        fetch(`/api/getLists?userId=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setLists(data.lists);
                }
            });
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchLists();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(false);
        if (mediaId && mediaType) {
            const fetchUrl = mediaType === "tv" ? `/api/getTv?id=${mediaId}` : `/api/getMovie?id=${mediaId}`;
            fetch(fetchUrl)
                .then((res) => res.json())
                .then((data) => {
                    setMedia(data.results as MediaPage);
                    setCredits(data.credits as Credits);
                    setIsLoading(false);
                });
        }
    }, [mediaId, mediaType, setIsLoading]);
    

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

    const handleButtonClick = (e: React.MouseEvent, mediaId: any) => {
        e.stopPropagation();
        setClickedButton((prevClickedButton) => (prevClickedButton === mediaId ? null : mediaId));
    };

    return (
        <Layout isLoggedIn={isLoggedIn} userType={userType}>
            <main>
                {isMobile ?
                    <div className="media-page-wrapper">
                        <h1>
                        {`${media?.title ?? media?.name}  (${new Date(`${media?.release_date ?? media?.first_air_date}`).getFullYear()})`}
                        </h1>
                        <div className="media-page-poster">
                            {isLoading ?
                                <Image
                                    src={'/icons/loading.svg'}
                                    width={40}
                                    height={40}
                                    alt={'loadin icon'}
                                />
                                :
                                <>
                                    <Image
                                        src={`https://www.themoviedb.org/t/p/original${media?.poster_path}`}
                                        width={280}
                                        height={300}
                                        alt={'media poster'}
                                    />
                                    <div className="rating-div">
                                        <Image
                                            src={'/icons/star.svg'}
                                            height={20}
                                            width={20}
                                            alt={'rating logo'}
                                        />
                                        <h3>{media?.vote_average?.toFixed(1)}</h3>
                                    </div>
                                    <p>{`"${media?.tagline}"`}</p>
                                    <ul>{media?.genres.map((genre) => <li key={genre.id}> {genre.name} </li>)}</ul>
                                </>
                            }
                        </div>

                        <div className="media-page-info">
                            <p className="info-text">{media?.overview}</p>

                            <div className="search-card-cast">
                                <h3>Cast</h3>
                                <ul>
                                    {credits?.cast?.slice(0, 9).map((c) =>
                                        <li key={c.cast_id}>{c.name}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        {isLoggedIn &&
                                <div
                                    className={`results-card-button add-button${clickedButton === media?.id ? " expanded-add-button" : ""}`}
                                    onClick={(e) => { handleButtonClick(e, media?.id) }}
                                >
                                    <AddButton
                                        media={media as Media}
                                        id={id} lists={lists}
                                        clickedButton={clickedButton}
                                        imgHeight={30}
                                        imgWidth={30}
                                    />
                                </div>
                            }
                    </div>
                    :
                    <div className="media-page-wrapper">
                        <div className="media-page-poster">
                            {isLoading ?
                                <Image
                                    src={'/icons/loading.svg'}
                                    width={40}
                                    height={40}
                                    alt={'loadin icon'}
                                />
                                :
                                <>
                                    <Image
                                        src={`https://www.themoviedb.org/t/p/original${media?.poster_path}`}
                                        width={400}
                                        height={600}
                                        alt={'media poster'}
                                    />
                                    <p>{`"${media?.tagline}"`}</p>
                                    <ul>{media?.genres.map((genre) => <li key={genre.id}> {genre.name} </li>)}</ul>
                                </>
                            }
                        </div>

                        <div className="media-page-info">
                            <h1 style={{ display: 'flex', alignItems: 'center' }}>
                                {`${media?.title ?? media?.name}  (${new Date(`${media?.release_date ?? media?.first_air_date}`).getFullYear()})`}
                                <div className="rating-div">
                                    <Image
                                        src={'/icons/star.svg'}
                                        height={30}
                                        width={30}
                                        alt={'rating logo'}
                                    />
                                    <h3>{media?.vote_average?.toFixed(1)}</h3>
                                </div>
                            </h1>
                            <p className="info-text">{media?.overview}</p>

                            <div className="search-card-cast">
                                <h3>Cast</h3>
                                <ul>
                                    {credits?.cast?.slice(0, 9).map((c) =>
                                        <li key={c.cast_id}>{c.name}</li>
                                    )}
                                </ul>
                            </div>

                            {isLoggedIn &&
                                <div
                                    className={`results-card-button add-button${clickedButton === media?.id ? " expanded-add-button" : ""}`}
                                    onClick={(e) => { handleButtonClick(e, media?.id) }}
                                >
                                    <AddButton
                                        media={media as Media}
                                        id={id} lists={lists}
                                        clickedButton={clickedButton}
                                        imgHeight={30}
                                        imgWidth={30}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                }
            </main>
        </Layout>
    )
};

const MediaPage: NextPage<MediaProps> = (props) => {
    return (
        <SearchProvider>
            <MediaInfo {...props} />
        </SearchProvider>
    );
};

export default MediaPage;
