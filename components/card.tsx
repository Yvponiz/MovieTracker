import Image from "next/image";
import { CSSProperties, FunctionComponent, useState } from "react";
import { Credits, Media } from "../models/media";
import Link from "next/link";

export type MediaCardProps = {
    media?: Media | null;
    credits?: Credits[];
    className: string;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
    style?: CSSProperties;
    mediaInfo?: boolean;
    setMediaInfo?: any;
    selectedMovieId?: number | null;
    isLoggedIn?: boolean;
    isLoading?: boolean;
};

const MediaCard: FunctionComponent<MediaCardProps> = (props: MediaCardProps) => {
    const { media,
        className,
        children,
        onClick,
        selectedMovieId,
        credits,
        isLoading
    } = props;
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;

    const handlePropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    return (
        <>
            {media &&
                <div key={media.id} className={className}
                    onClick={onClick}
                >
                    {isLoading ?
                        <Image
                            src={'/icons/loading.svg'}
                            width={40}
                            height={40}
                            alt={'loadin icon'}
                        />
                        :
                        <Image
                            className="search-card-poster"
                            src={`https://www.themoviedb.org/t/p/original${media.poster_path}`}
                            width={isMobile ? 100 : 200}
                            height={isMobile ? 150 : 300}
                            alt={'media poster'}
                        />
                    }

                    <div className="search-card-content">
                        <div className="search-card-content-top">
                            <Link href={`/mediaInfo?id=${media.id}&media_type=${media.media_type}`} onClick={(e)=>{handlePropagation(e)}}>
                                {media.media_type === "movie" ? <h3>{media.title}</h3> : <h3>{media.name}</h3>}
                            </Link>

                            <div className="rating-div">
                                <Image
                                    src='/icons/star.svg'
                                    height={isMobile ? 15 : 20}
                                    width={isMobile ? 15 : 20}
                                    alt='star icon'
                                />
                                <p>{media.vote_average?.toPrecision(2)}</p>
                            </div>
                        </div>

                        <div className="media-year">
                            <p>{new Date(`${media.release_date ?? media.first_air_date}`).getFullYear()}</p>
                        </div>

                        {className === "search-card" && isMobile ? <></> :
                            <div className="info-text">
                                {media.overview ? <p>{media.overview}</p> : <p>{`Aye man, I couldn't find no summary`}</p>}
                            </div>
                        }

                        {!isMobile && selectedMovieId === media.id && credits &&
                            <div className="search-card-cast">
                                <h3>Cast</h3>
                                <ul>
                                    {credits?.filter((credit) => credit.id === media.id)
                                        .map((credit) =>
                                            credit.cast?.slice(0, 9).map((c) => (
                                                <li key={c.id}>{c.name}</li>
                                            ))
                                        )}
                                </ul>
                            </div>
                        }
                        {children}
                    </div>
                </div>
            }
        </>
    );
};

export default MediaCard;