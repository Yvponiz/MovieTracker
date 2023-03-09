import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from './getSession'

export type UserProps = {
    isLoggedIn: boolean;
    username?: string;
    email?: string;
};

export default async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session = await getSession(req, res);

    return {
        props: {
            isLoggedIn: !!session?.user?.id,   // !! pour s'assurer que ce soit un bool
            username: session?.user?.username ?? null,
            email: session?.user?.email ?? null,
            lists: session?.user?.lists ?? null
        },
    };
}