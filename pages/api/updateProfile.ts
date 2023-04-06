import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import client from "../../utils/DButils";
import { getSession } from '../../utils/getSession';

export default async function updateProfile(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, errors: string[] }>
) {
    try {
        await client.connect();
        const { username, newUsername, newEmail } = req.body;
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');
        
        const updateFields: any = {};
        if (newUsername) {
            updateFields.username = newUsername;
        }
        if (newEmail) {
            updateFields.email = newEmail;
        }

        const result = await usersCollection.updateOne({ username }, { $set: updateFields });

        if (result.matchedCount === 0) {
            res.status(404).json({ status: "error", errors: ["Couldn't update"] });
            return;
        }

        const updatedUser = await usersCollection.findOne({ username: newUsername || username });
        const session = await getSession(req, res);
        session.user = {
            id: updatedUser?._id,
            username: updatedUser?.username,
            email: updatedUser?.email,
        };
        await session.commit();

        return res.json({ status: "success", errors: [] });

    } catch (error: any) {
        return res.status(500).send(error.toString());
    } finally {
        await client.close();
    }
};