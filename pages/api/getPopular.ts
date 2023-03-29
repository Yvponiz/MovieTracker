import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

export default async function getPopular(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const key = process.env.API_KEY;
    const response = await fetch (`https://api.themoviedb.org/3/movie/popular?api_key=${key}`)
    const json = await response.json();

    res.status(200).json(json);
}