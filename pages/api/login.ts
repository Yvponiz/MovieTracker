import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import client from "../../utils/DButils";
import { getSession } from '../../utils/getSession';

export default async function login(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, errors: string[] }>
) {
    try {
        await client.connect();
        const { username, password } = req.body
        const database = client.db("movietracker");
        const usersCollection = database.collection<User>('users');
        const user = await usersCollection.findOne({ username });
        const passwordMatches = await bcrypt.compare(password, user!.password);

        if (!user) {
            res.status(404).json({ status: "error", errors: ["Invalid username or password"] });
            return;
        }

        if (!passwordMatches) {
            res.status(404).json({ status: "error", errors: ["Invalid username or password"] });
            return;
        }

        const session = await getSession(req, res);
        session.user ={
            id: user._id,
            username: user.username,
            email: user.email,
            lists: user.lists,
            userType: user.userType
        }

        await session.commit();
        
        console.log(`User ${user.username} connected`);

        return res.json({ status: "success", errors: [] });

    } catch (error: any) {
        return res.status(500).send(error.toString())
    } finally {
        await client.close();
    }
};
