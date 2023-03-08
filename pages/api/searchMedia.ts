import type { NextApiRequest, NextApiResponse } from 'next'
import * as dotenv from "dotenv";
import { MovieSearchResults } from '../../models/media';
import * as DButils from '../../utils/DButils';
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

  const filteredResults = json.results.filter((result: { poster_path: null; media_type: string; }) => {
    return result.poster_path !== null && (result.media_type === "movie" || result.media_type === "tv");
  });

  const searchData: MovieSearchResults = {
    results: filteredResults
  }

  res.status(200).json(searchData)
}
