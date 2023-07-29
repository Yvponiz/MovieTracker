import Link from "next/link";
import Image from "next/image"
import { FunctionComponent } from "react";
import { useRouter } from 'next/router';

type HeaderProps = {
    isLoggedIn: boolean;
    userType: string;
};

const ShowHeader: FunctionComponent<HeaderProps> = ({ isLoggedIn, userType }) => {
    const router = useRouter();

    return (
        <nav>
            <ul>
                <Link href='/'>
                    <li className={router.pathname === '/' ? 'active' : ''}>Home</li>
                </Link>
                <Link href='/lists'>
                    <li className={router.pathname === '/lists' ? 'active' : ''}>Lists</li>
                </Link>
                <Link href='/search'>
                    <li className={router.pathname === '/search' || router.pathname.startsWith('/results') ? 'active' : ''}>Search</li>
                </Link>
                {isLoggedIn &&
                    <Link href='/account'>
                        <li className={router.pathname === '/account' ? 'active' : ''}>Account</li>
                    </Link>
                }

                {isLoggedIn && userType === 'admin' &&
                    <Link href='/dashboard'>
                        <li className={router.pathname === '/dashboard' ? 'active' : ''}>Dashboard</li>
                    </Link>
                }

                {isLoggedIn ?
                    <Link href='/api/logout'>
                        <li>Logout</li>
                    </Link>
                    :
                    <Link href='/login'>
                        <li className={router.pathname === '/login' ? 'active' : ''}>Login</li>
                    </Link>
                }

            </ul>
        </nav>
    )
}

export default function Header({ isLoggedIn, userType }: HeaderProps) {

    return (
        <div className='header'>
            <ShowHeader isLoggedIn={isLoggedIn} userType={userType} />
        </div>
    )
}


