import Link from "next/link";
import Image from "next/image"
import { FunctionComponent } from "react";

type HeaderProps = {
    isLoggedIn: boolean;
};

const ShowHeader: FunctionComponent<HeaderProps> = ({ isLoggedIn }) => {
    return (
        isLoggedIn ?
            <>
                <Link href='/'>Home</Link>
                <Link href='/lists'>Lists</Link>
                <Link href='/search'>Search</Link>
                <Link href='/profile'>Profile</Link>
                <Link href='/api/logout'>Logout</Link>
            </> :

            <>
                <Link href='/'>Home</Link>
                <Link href='/login'>Login</Link>
            </>

    )
}

export default function Header({ isLoggedIn }: HeaderProps) {

    return (
        <div className='header'>
            <ShowHeader isLoggedIn={isLoggedIn} />
        </div>
    )
}


