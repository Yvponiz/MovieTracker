import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { User, UserList } from "../../models/user";
import client from "../../utils/DButils";

export default async function getUserLists(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, lists?: UserList[], messages?: string[] }>
) {
    try {
        await client.connect();
        
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');
        const userId = new ObjectId((req.query.userId)?.toString());
        const user = await usersCollection.findOne({ _id: userId });
        const userLists = user?.lists;

        if (!userLists || userLists.length === 0) {
            res.status(200).json({
                status: "empty",
                messages: ["You have no lists!"]
            });
            return;
        }

        return res.status(200).json({ status: "success", lists: userLists});

    } catch (error: any) {
        return res.status(500).send(error.toString())
    } 
}