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

    // Calculate the timestamp for sessions that have not been accessed in the last 24 hours
    const inactiveTime = new Date().getTime() - 24 * 60 * 60 * 1000;

    // Delete all sessions that have not been accessed in the last 24 hours
    const result = await session.deleteMany({ lastAccessed: { $lt: inactiveTime } });
    console.log(`${result.deletedCount} inactive sessions deleted`);
    res.status(200).end('Hello Cron!');
  } catch (error: any) {
    return res.status(500).send(error.toString());
  } finally {
    await client.close();
  }
}
