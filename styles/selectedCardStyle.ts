import { Media } from "../models/media";

interface styleParams {
    isMobile: boolean;
    selectedMovieId: number | null;
    watched?: boolean;
}

export const openSelectedStyle = ({ isMobile, selectedMovieId }: styleParams, media: Media): React.CSSProperties => ({
    height: isMobile
        ? selectedMovieId === media.id ? "360px" : "300px"
        : selectedMovieId === media.id ? "600px" : "300px",
    width: isMobile
        ? selectedMovieId === media.id ? "360px" : "260px"
        : selectedMovieId === media.id ? "560px" : "300px",
    zIndex: isMobile
        ? 0
        : selectedMovieId === media.id ? 1 : 0,
    position: isMobile
        ? 'initial'
        : selectedMovieId === media.id ? "fixed" : 'initial',
    top: isMobile
        ? 'auto'
        : selectedMovieId === media.id ? "50%" : "auto",
    left: isMobile
        ? 'auto'
        : selectedMovieId === media.id ? "50%" : "auto",
    transform: isMobile
        ? "translate(0)"
        : selectedMovieId === media.id ? "translate(-50%, -50%)" : "translate(0)",
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
    border: watched? 'solid 2px green': ''
})