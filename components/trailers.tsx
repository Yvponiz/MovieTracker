import { FunctionComponent, useEffect, useState } from "react";
import { MovieWithTrailers } from "../models/trailer";

const Trailers: FunctionComponent = () => {
    const [trailers, setTrailers] = useState<MovieWithTrailers[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        fetch(`/api/getTrailer`)
            .then(response => response.json())
            .then(data => {
                console.log(data.moviesWithTrailers);
                setTrailers(data.moviesWithTrailers);
            });
    }, []);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 500);
        };
        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    return (
        <div className="trailers-section">  
            <h3>Latest Trailers</h3>
            <div className="trailers-div">
                {trailers?.slice(0, 5).map(({ movie, trailers }) => {
                    const trailer = trailers.find(t => t.type === 'Trailer');
                    if (!trailer) return null;

                    return (
                        <div
                            key={trailer.id}
                            className="trailer"
                        >
                            <h3>{movie.title}</h3>
                            <iframe
                                title={trailer.name}
                                width={isMobile ? 200 : 560}
                                height={isMobile ? 155 : 315}
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Trailers;