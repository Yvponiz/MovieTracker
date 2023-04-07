import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../models/user';
import client from "../../utils/DButils";

export default async function deleteAccount(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, errors: string[] }>
) {
    try {
        await client.connect();
        const username = req.query.user;
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');

        await usersCollection.deleteOne({ username });
        // const deleteResult = await usersCollection.deleteOne({ id });
        // console.log("Delete result:", deleteResult);


        return res.json({ status: "success", errors: [] });

    } catch (error: any) {
        return res.status(500).send(error.toString());
    } finally {
        await client.close();
    }
};
