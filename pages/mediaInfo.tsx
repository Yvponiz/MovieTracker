import { NextPage } from "next";
import { FunctionComponent, useEffect, useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { MediaPage } from "../models/mediaPage";
import { SearchProvider, useSearch } from "../context/searchContext";
import Image from "next/image";
import { Credits } from "../models/media";

type MediaProps = MediaPage;

const MediaInfo: FunctionComponent<MediaProps> = ({ }) => {
    const [media, setMedia] = useState<MediaPage>()
    const [credits, setCredits] = useState<Credits>();
    const { isLoading, setIsLoading } = useSearch();
    const router = useRouter();
    const movieId = router.query.id;
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;

    useEffect(() => {
        setIsLoading(false);
        if (movieId) {
            fetch(`/api/getMedia?id=${movieId}`)
                .then((res) => res.json())
                .then((data) => {
                    setMedia(data.results as MediaPage);
                    setCredits(data.credits as Credits)
                    setIsLoading(false);
                });
        }
    }, [movieId]);

    return (
        <Layout>
            <main>
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
                                    width={isMobile ? 280 : 400}
                                    height={isMobile ? 300 : 600}
                                    alt={'media poster'}
                                />
                                <p>{`"${media?.tagline}"`}</p>
                                <ul>{media?.genres.map((genre) => <li key={genre.id}> {genre.name} </li>)}</ul>
                            </>
                        }
                    </div>

                    <div className="media-page-info">
                        <h1 style={{ display: 'flex', alignItems: 'center' }}>
                            {`${media?.title} (${new Date(`${media?.release_date}`).getFullYear()})`}
                            <div className="rating-div">
                                <Image
                                    src={'/icons/star.svg'}
                                    height={isMobile ? 25 : 30}
                                    width={isMobile ? 25 : 30}
                                    alt={'rating logo'}
                                />
                                <h3>{media?.vote_average.toFixed(1)}</h3>
                            </div>
                        </h1>
                        <p className="info-text">{media?.overview}</p>
                        
                        <div className="search-card-cast">
                            <h3>Cast</h3>
                            <ul>
                                {credits?.cast?.map((c) =>
                                    <li key={c.cast_id}>{c.name}</li>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>

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
