import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";

dotenv.config();

export default async function getTrailer(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const key = process.env.API_KEY;
    const response = await fetch(`
    https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1
    `);
    const upcoming = await response.json();
    const upcomingMovies = upcoming.results;

    const moviesWithTrailers = [];

    for (const movie of upcomingMovies) {
        const movieId = movie.id;

        const trailersResponse = await fetch(`
        https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${key}&language=en-US
        `);

        const mediaTrailers = await trailersResponse.json();

        const filteredTrailers = mediaTrailers.results.filter((trailer: { type: string; }) => trailer.type === 'Trailer');

        if (filteredTrailers.length > 0) {
            moviesWithTrailers.push({
                movie,
                trailers: filteredTrailers
            });
        }
    }

    res.status(200).json({ moviesWithTrailers });
}
