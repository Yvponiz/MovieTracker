import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Media } from "../../models/media";
import { User, UserList } from "../../models/user";
import client from "../../utils/DButils";

export default async function removeFromList(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, message?: string[], errors?: string[] }>
) {
    try {
        await client.connect();

        const { listName, media } = req.body;
        const userId = new ObjectId((req.query.userId)?.toString());
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');
        const user = await usersCollection.findOne({ _id: userId });
        const listIndex = user?.lists?.findIndex((list) => list.name === listName);
        const mediaIndex = user?.lists![listIndex!].items.findIndex((item) => item.id === media.id);
        console.log(`LISTNAME: ${listName} \n MEDIA: ${media}`)

        // if (mediaIndex === undefined) {
        //     return res.status(404).json({ status: "error", errors: ["Media not found in list"] });
        // }

        user?.lists![listIndex!].items.splice(mediaIndex!, 1);

        const result = await usersCollection.updateOne(
            { _id: userId },
            { $set: { lists: user?.lists } }
        );

        if (result.acknowledged) {
            return res.status(201).json({ status: "success", message: [`Media removed from list ${listName}`] });
        } else {
            return res.status(500).json({ status: "error", errors: ["Failed to delete media"] });
        }
    } catch (error: any) {
        return res.status(500).send(error.toString())
    } finally {
        await client.close();
    }
}