interface styleParams {
    isMobile: boolean;
    selectedMovieId: number | null;
    watched?: boolean;
}

export const openSelectedStyle = ({ isMobile, selectedMovieId }: styleParams, mediaId: number): React.CSSProperties => ({
    height: isMobile
        ? selectedMovieId === mediaId ? "360px" : "300px"
        : selectedMovieId === mediaId ? "560px" : "260px",
    width: isMobile
        ? selectedMovieId === mediaId ? "360px" : "260px"
        : selectedMovieId === mediaId ? "560px" : "260px",
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
    transition: "all 0.1s ease-in-out"
});

export const listCardSelectedStyle = ({ selectedMovieId, isMobile, watched }: styleParams, mediaId: number): React.CSSProperties => ({
    height: isMobile
        ? selectedMovieId === mediaId ? "260px" : "200px"
        : selectedMovieId === mediaId ? "560px" : "360px",
    width: isMobile
        ? selectedMovieId === mediaId ? "260px" : "160px"
        : selectedMovieId === mediaId ? "560px" : "360px",
    zIndex: selectedMovieId === mediaId ? 1 : 0,
    border: watched? 'solid 1.5px green': ''
})