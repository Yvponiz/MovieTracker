import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from '../../utils/getSession';

export default async function disconnectSession(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession(req, res)
    await session.destroy();
    
    res.status(200).redirect("/")
}