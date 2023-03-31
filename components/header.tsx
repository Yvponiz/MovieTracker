import Link from "next/link";
import Image from "next/image"
import { FunctionComponent } from "react";
import { useRouter } from 'next/router';

type HeaderProps = {
    isLoggedIn: boolean;
};

const ShowHeader: FunctionComponent<HeaderProps> = ({ isLoggedIn }) => {
    const router = useRouter();

    return (
        <nav>
            <ul>
                <li className={router.pathname === '/' ? 'active' : ''}>
                    <Link href='/'>Home</Link>
                </li>
                <li className={router.pathname === '/lists' ? 'active' : ''} >
                    <Link href='/lists'>Lists</Link>
                </li>
                <li className={router.pathname === '/search' || router.pathname.startsWith('/results') ? 'active' : ''}>
                    <Link href='/search'>Search</Link>
                </li>
                <li className={router.pathname === '/profile' ? 'active' : ''}>
                    <Link href='/profile'>Profile</Link>
                </li>
                <li className={router.pathname === '/login' ? 'active' : ''}>
                    {isLoggedIn ?
                        <Link href='/api/logout'>Logout</Link> :
                        <Link href='/login'>Login</Link>
                    }
                </li>
            </ul>
        </nav>
    )
}

export default function Header({ isLoggedIn }: HeaderProps) {

    return (
        <div className='header'>
            <ShowHeader isLoggedIn={isLoggedIn} />
        </div>
    )
}


