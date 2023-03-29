import { Media } from "../models/media";

interface styleParams {
    isMobile: boolean;
    selectedMovieId: number | null;
    watched?: boolean;
}

export const openSelectedStyle = ({ isMobile, selectedMovieId }: styleParams, media: Media): React.CSSProperties => ({
    height: isMobile ? "300px" : "300px",
    width: isMobile ? "260px" : "300px",
    transition: "all 0.1s ease-in-out",
    backgroundImage: `url(https://www.themoviedb.org/t/p/original${media.poster_path})`
});

export const listCardSelectedStyle = ({ selectedMovieId, isMobile, watched }: styleParams, mediaId: number): React.CSSProperties => ({
    height: isMobile
        ? selectedMovieId === mediaId ? "260px" : "200px"
        : selectedMovieId === mediaId ? "560px" : "360px",
    width: isMobile
        ? selectedMovieId === mediaId ? "260px" : "160px"
        : selectedMovieId === mediaId ? "560px" : "360px",
    zIndex: selectedMovieId === mediaId ? 1 : 0,
    border: watched ? 'solid 2px green' : ''
})