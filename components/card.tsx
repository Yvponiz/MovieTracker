import Image from "next/image";
import { createContext, CSSProperties, FunctionComponent, useContext, useState } from "react";
import { Media } from "../models/media";

export type MediaCardProps = {
    media?: Media;
    className: string;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
    style?: CSSProperties;
    mediaInfo?: boolean;
    setMediaInfo?: any;
    selectedMovieId?: number | null;
};

export const MediaCardContext = createContext({ height: 200, width: 100, page: '' });

const MediaCard: FunctionComponent<MediaCardProps> = (props: MediaCardProps) => {
    const { media,
        className,
        children,
        onClick,
        onMouseEnter,
        onMouseLeave,
        style,
        setMediaInfo,
        selectedMovieId
    } = props;
    const { height, width, page } = useContext(MediaCardContext);

    const handleInfoClick = (mediaId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedMovieId === mediaId) {
            setMediaInfo((mediaInfo: any) => !mediaInfo);
        }
    };

    return (
        <>
            {media &&
                <div key={media.id} className={className}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    style={style}
                >
                    <div className="trending-card-content">
                        <div className="card-title-div">

                            {media.media_type === "movie" ? <h3>{media.title}</h3> : <h3>{media.name}</h3>}

                            {selectedMovieId === media.id &&
                                <Image className="info-icon"
                                    src='icons/info.svg'
                                    width={20}
                                    height={20}
                                    alt='summary icon'
                                    onClick={(e) => { handleInfoClick(media.id, e) }}
                                />
                            }

                        </div>

                        <Image
                            src={`https://www.themoviedb.org/t/p/original${media.poster_path}`}
                            height={height}
                            width={width}
                            alt={"media image"}
                            className='media-image'
                        />

                        <div className="media-year">
                            {media.media_type === "movie" ?
                                <p>{new Date(`${media.release_date}`).getFullYear()}</p>
                                : <p>{new Date(`${media.first_air_date}`).getFullYear()}</p>
                            }
                        </div>

                        {children}

                    </div>
                </div>}
        </>
    );
};

export default MediaCard;