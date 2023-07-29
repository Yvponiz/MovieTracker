import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../models/user";
import client from "../../utils/DButils";

export default async function updateWatched(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, message?: string[], errors?: string[] }>
) {
    try {
        await client.connect();

        const { listName, watched, media } = req.body;
        const userId = new ObjectId((req.query.userId)?.toString());
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');
        const user = await usersCollection.findOne({ _id: userId });
        const listIndex = user?.lists?.findIndex((list) => list.name === listName);
        const mediaIndex = user?.lists![listIndex!].items.findIndex((item) => item.id === media.id);
        const mediaTitle = media.media_type === "movie" ? media.title : media.name;
        const watchedMessage = `${mediaTitle} set to ${watched ? "watched" : "unwatched"}`;

        // Check if the media is watched in all lists
        let isMediaWatchedInAllLists = true;
        for (const list of user?.lists || []) {
            const mediaIndex = list.items.findIndex((item) => item.id === media.id);
            if (mediaIndex >= 0 && !list.items[mediaIndex].watched) {
                isMediaWatchedInAllLists = false;
                break;
            }
        }

        // Set the watched status of the media in all lists
        for (const list of user?.lists || []) {
            const mediaIndex = list.items.findIndex((item) => item.id === media.id);
            if (mediaIndex >= 0) {
                list.items[mediaIndex].watched = isMediaWatchedInAllLists ? true : watched;
            }
        }

        const result = await usersCollection.updateOne(
            { _id: userId },
            { $set: { lists: user?.lists } }
        );

        if (result.acknowledged) {
            return res.status(201).json({ status: "success", message: [watchedMessage] });
        } else {
            return res.status(500).json({ status: "error", errors: ["Failed to change media to watched"] });
        }
    } catch (error: any) {
        return res.status(500).send(error.toString())
    } finally {
        await client.close();
    }
}