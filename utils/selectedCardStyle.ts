interface OpenSelectedStyleParams {
    isMobile: boolean;
    selectedMovieId: number | null;
}

export const openSelectedStyle = ({ isMobile, selectedMovieId }: OpenSelectedStyleParams, mediaId: number): React.CSSProperties => ({
    height: isMobile
        ? selectedMovieId === mediaId ? "360px" : "300px"
        : selectedMovieId === mediaId ? "360px" : "260px",
    width: isMobile
        ? "260px"
        : selectedMovieId === mediaId ? "360px" : "260px",
    zIndex: isMobile
        ? 0
        : selectedMovieId === mediaId ? 1 : 0,
    position: isMobile
        ? 'initial'
        : selectedMovieId === mediaId ? "fixed" : 'initial',
    top: isMobile
        ? 'auto'
        : selectedMovieId === mediaId ? "50%" : "auto",
    left: isMobile
        ? 'auto'
        : selectedMovieId === mediaId ? "50%" : "auto",
    transform: isMobile
        ? "translate(0)"
        : selectedMovieId === mediaId ? "translate(-50%, -50%)" : "translate(0)",
});