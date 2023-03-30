import type { NextApiRequest, NextApiResponse } from 'next'
import * as dotenv from "dotenv";
import { Cast, Credits, Media, MovieSearchResults } from '../../models/media';

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovieSearchResults>
) {
  const key = process.env.API_KEY;
  const query = req.query.q;
  const response = await fetch(`
  https://api.themoviedb.org/3/search/multi?api_key=${key}&language=en-US&query=${query}&page=1&include_adult=false
  `)
  const json = await response.json();

  const filteredResults = json.results ? json.results.filter((result: { poster_path: null; media_type: string; }) => {
    return result.poster_path !== null && (result.media_type === "movie" || result.media_type === "tv");
  }) : [];


  const creditsResults = await Promise.all(
    filteredResults.map(async (result: Media) => {
      const movieId = result.id;
      const mediaCredits = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${key}&language=en-US`
      );
      const creditsJson = await mediaCredits.json();
      return creditsJson;
    })
  );

  const searchData: MovieSearchResults = {
    results: filteredResults,
    credits: creditsResults
  }

  res.status(200).json(searchData)
}
