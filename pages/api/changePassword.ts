import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import client from "../../utils/DButils";
import { getSession } from '../../utils/getSession';

export default async function changePassword(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, errors: string[] }>
) {
    try {
        await client.connect();
        const { username, password, newPassword, confPassword } = req.body;
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            res.status(404).json({ status: "error", errors: ["Cannot find user"] });
            return;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            res.status(404).json({ status: "error", errors: ["Invalid password"] });
            return;
        }

        if (newPassword !== confPassword) {
            res.status(404).json({ status: "error", errors: ["Both passwords must be identical"] });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await usersCollection.updateOne({ username }, { $set: { password: hashedPassword } });

        console.log(`User ${user.username} password changed`);

        return res.json({ status: "success", errors: [] });

    } catch (error: any) {
        return res.status(500).send(error.toString());
    } finally {
        await client.close();
    }
};