import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { User, UserList } from "../../models/user";
import client from "../../utils/DButils";
import { nanoid } from 'nanoid';


export default async function createList(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, message?: string[], errors?: string[] }>
) {
    try {
        await client.connect();

        const { listName } = req.body;
        const userId = new ObjectId((req.query.userId)?.toString());
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');

        if (listName.length === 0) {
            res.status(400).json({ status: "error", errors: ["List name must be at least 1 character"] })
            return
        }

        const user = await usersCollection.findOne({ _id: userId });

        if (user) {
            const updatedLists = user?.lists?.map((list: UserList) => {
                if (!list.id) {
                    list.id = nanoid();
                }
                return list;
            });

            await usersCollection.updateOne(
                { _id: userId },
                { $set: { lists: updatedLists } }
            );
        }

        const newList: UserList = {
            id: nanoid(),
            name: listName,
            items: []
        };

        const result = await usersCollection.updateOne(
            { _id: userId },
            { $push: { lists: newList } }
        );

        if (result.acknowledged) {
            return res.status(201).json({ status: "success", message: ["List created!"] });
        } else {
            return res.status(500).json({ status: "error", errors: ["Failed to create list"] });
        }
    } catch (error: any) {
        return res.status(500).send(error.toString())
    } finally {
        await client.close();
    }
}