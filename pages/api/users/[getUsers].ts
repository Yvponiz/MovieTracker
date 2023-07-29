import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../utils/DButils';
import { User } from '../../../models/user';

export default async function getUsers(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, errors: string[], usersListInfo: {} }>
) {
    try {
        await client.connect();
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');
        const sessionCollection = database.collection('session');
        const usersList = await usersCollection.find({}).toArray();
        const sessionList = await sessionCollection.find({}).toArray();
        
        const usersListInfo = usersList.map((user) => {
            const sessionData = sessionList.find((session) => {
                const data = JSON.parse(session.data);
                return data?.user?.username === user.username;
            });

            return {
                id: user._id,
                username: user.username,
                email: user.email,
                lists: user.lists,
                lastAccessed: sessionData?.lastAccessed
            };
        });

        // console.log(usersListInfo)

        return res.json({ status: "success", errors: [], usersListInfo });

    } catch (error: any) {
        return res.status(500).send(error.toString());
    } finally {
        await client.close();
    }
};
