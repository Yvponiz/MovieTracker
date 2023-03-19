import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../models/user";
import client from "../../utils/DButils";

export default async function deleteList(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, message?: string[], errors?: string[] }>
) {
    try {
        await client.connect();

        const { listName } = req.body;
        const userId = new ObjectId((req.query.userId)?.toString());
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');

        const result = await usersCollection.updateOne(
            { _id: userId },
            { $pull: { lists: { name: listName } } }
        );

        if (result.acknowledged) {
            return res.status(201).json({ status: "success", message: ["List deleted!"] });
        } else {
            return res.status(500).json({ status: "error", errors: ["Failed to delete list"] });
        }
    } catch (error: any) {
        return res.status(500).send(error.toString())
    } finally {
        await client.close();
    }
}