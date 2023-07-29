import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from './getSession'

export type UserProps = {
    isLoggedIn: boolean;
    id?: string;
    username?: string;
    email?: string;
    userType?: string;
    lastAccessed?: number;
};

export default async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session = await getSession(req, res);

    return {
        props: {
            isLoggedIn: !!session?.user?.id,   // !! pour s'assurer que ce soit un bool
            id: session?.user?.id ?? null,
            username: session?.user?.username ?? null,
            email: session?.user?.email ?? null,
            lists: session?.user?.lists ?? null,
            userType: session?.user?.userType ?? null,
            lastAccessed: session?.user?.lastAccessed ?? null
        },
    };
}