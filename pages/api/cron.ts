import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "../../models/session";
import client from "../../utils/DButils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await client.connect();
        const database = client.db("movietracker");
        const session = database.collection<Session>('session');

        const result = await session.deleteMany({});
        console.log(`${result.deletedCount} documents deleted`);
        res.status(200).end('Hello Cron!');
    }
    catch (error: any) {
        return res.status(500).send(error.toString())
    } finally {
        await client.close();
    }
};