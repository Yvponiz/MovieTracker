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
            res.status(404).json({ status: "error", errors: ["Invalid email or password"] });
            return;
        }

        if (!passwordMatches) {
            res.status(404).json({ status: "error", errors: ["Invalid email or password"] });
            return;
        }

        const session = await getSession(req, res);
        session.user ={
            id: user._id,
            username: user.username,
            email: user.email,
            lists: user.lists
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


// function generateSessionId(): string {
//     return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }

// if (user._id) {
//     // Generate a unique session ID and store it in the sessions collection
//     const sessionId = generateSessionId();
//     const session = {
//         _id: new ObjectId(),
//         userId: new ObjectId(user._id),
//         createdAt: new Date(),
//     };
//     await database.collection('session').insertOne(session);

//     // Set a cookie in the user's browser containing the session ID
//     res.setHeader('Set-Cookie', cookie.serialize('sessionId', sessionId, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 604800, // 1 week
//         path: '/',
//     }));

//     // Respond with success message
//     res.status(200).json({ status: "success", errors: [] });
// } else {
//     // Respond with error message
//     res.status(401).json({ status: "erreur", errors: ['Invalid credentials'] });
// }

// // Protected API endpoint
// export default async function protectedRoute(req: NextApiRequest, res: NextApiResponse) {
//     const { sessionId } = cookie.parse(req.headers.cookie || '');

//     if (sessionId) {
//         // Retrieve session data from the sessions collection
//         const session = await req.db.collection('sessions').findOne({ _id: new ObjectId(sessionId) });

//         if (session) {
//             // Authenticate user and provide session information
//             const userId = session.userId.toHexString();
//             const userInfo = await getUserInfo(userId);
//             res.status(200).json({ userId, ...userInfo });
//         } else {
//             // Respond with error message
//             res.status(401).json({ error: 'Invalid session ID' });
//         }
//     } else {
//         // Respond with error message
//         res.status(401).json({ error: 'Session ID not found' });
//     }
// }
