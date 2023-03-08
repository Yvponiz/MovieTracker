import { getSession } from './getSession'

export type GreetingProps = {
    isLoggedIn: boolean;
    username?: string;
};

export type UserProps = {
    isLoggedIn: boolean;
    username: string;
    email: string;
};

export default async function getServerSideProps({ req, res }) {
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