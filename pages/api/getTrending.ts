import { NextRequest, NextResponse } from "next/server"
import * as dotenv from "dotenv";

dotenv.config();

export default async function getTrending(
    req: NextRequest,
    res: NextResponse
) {
    const key = process.env.API_KEY;
    
}