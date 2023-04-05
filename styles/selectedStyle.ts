import { Media } from "../models/media";

interface styleParams {
    isMobile: boolean;
    selectedMovieId: number | null;
    watched?: boolean;
    clicked?: boolean
}

export const addButtonStyle = ({ isMobile, selectedMovieId }: styleParams, media: Media): React.CSSProperties => ({
    height: isMobile ? "300px" : "300px",
    width: isMobile ? "260px" : "300px",
    transition: "all 0.3s ease-in-out",
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