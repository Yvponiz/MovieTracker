import type { NextApiRequest, NextApiResponse } from 'next'
import * as dotenv from "dotenv";
import { MovieSearchResults } from '../../models/media';

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovieSearchResults>
) {
  const key = process.env.API_KEY;
  const query = req.query.q;
  const response = await fetch(`
  https://api.themoviedb.org/3/movie/${query}?api_key=${key}&language=en-US
  `)

  const json = await response.json();
  console.log("JSON",json)

  res.status(200).json(json)
}
