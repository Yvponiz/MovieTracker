import type { NextApiRequest, NextApiResponse } from 'next'
import * as dotenv from "dotenv";
import { MediaPage } from '../../models/mediaPage';

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const key = process.env.API_KEY;
  const query = req.query.id;
  const response = await fetch(`
  https://api.themoviedb.org/3/movie/${query}?api_key=${key}&language=en-US
  `)

  const json = await response.json();
  const movieId = json.id;

  const mediaCredits = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${key}&language=en-US`
  );
  const creditsJson = await mediaCredits.json();

  const searchData = {
    results: json,
    credits: creditsJson
  }

  res.status(200).json(searchData)
}
