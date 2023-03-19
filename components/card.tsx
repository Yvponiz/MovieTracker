import Image from "next/image";
import { CSSProperties, FunctionComponent } from "react";
import { Media } from "../models/media";


type MediaCardProps = {
    media: Media;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    style?: CSSProperties;
};

const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;

const MediaCard: FunctionComponent<MediaCardProps> = (props: MediaCardProps) => {
    const { media, children, onClick, style } = props;
    return (
        <div key={media.id} className="card" onClick={onClick} style={style}>
            <div className="card-content">
                {media.media_type === "movie" ? <h3>{media.title}</h3> : <h3>{media.name}</h3>}
                <Image
                    src={`https://www.themoviedb.org/t/p/original${media.poster_path}`}
                    height={isMobile? 100: 200}
                    width={isMobile? 50: 100}
                    alt={"media image"}
                />
                {media.media_type === "movie" ?
                    <p>{new Date(`${media.release_date}`).getFullYear()}</p>
                    : <p>{new Date(`${media.first_air_date}`).getFullYear()}</p>
                }
                {children}
            </div>
        </div>
    );
};

export default MediaCard;