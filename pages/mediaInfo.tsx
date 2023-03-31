import { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { MediaPage } from "../models/mediaPage";
import { useSearch } from "../context/searchContext";
import Image from "next/image";

type MediaProps = MediaPage;

const MediaInfo: NextPage<MediaProps> = ({ }) => {
    const [media, setMedia] = useState<MediaPage>()
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
                    setMedia(data as MediaPage);
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
                        <Image
                            src={`https://www.themoviedb.org/t/p/original${media?.poster_path}`}
                            width={isMobile ? 200: 400}
                            height={isMobile ? 300: 600}
                            alt={'media poster'}
                        />
                    }

                    </div>

                    <div className="media-page-info">
                        <h1>{`${media?.title} (${new Date(`${media?.release_date}`).getFullYear()})`}</h1>
                        <p className="info-text">{media?.overview}</p>
                        <div className="rating-div">
                            <Image
                                src={'/icons/star.svg'}
                                height={isMobile ? 25 : 30}
                                width={isMobile ? 25 : 30}    
                                alt={'rating logo'}
                            />
                            <h3>{media?.vote_average.toFixed(1)}</h3>                            
                        </div>
                    </div>


                </div>

            </main>
        </Layout>
    )
};

export default MediaInfo;
