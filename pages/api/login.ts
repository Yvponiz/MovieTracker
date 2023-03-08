import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import client from "../../utils/DButils";

export default async function login(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, errors: string[] }>
) {
    try {
        await client.connect();
        const { username, password } = req.body
        const database = client.db("movietracker");
        const users = database.collection<User>('users');
        const user = await users.findOne({ username });
        const passwordMatches = await bcrypt.compare(password, user!.password);

        if (!user) {
            res.status(404).json( {status:"erreur", errors:["Invalid email or password"]});
            return;
        }
        
        if (!passwordMatches) {
            res.status(404).json( {status:"erreur", errors:["Invalid email or password"]});
            return;
        }
        return res.json({ status: "success", errors: [] });

    } catch (error: any) {
        return res.status(500).send(error.toString())
    } finally {
        await client.close();
    }
};
