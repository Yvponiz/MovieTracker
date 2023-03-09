import { ReactElement } from "react";
import Link from "next/link";


type FooterProps = {
    [name: string]: ReactElement[]
};

export default function Footer({ }: FooterProps) {
    return (
        <div className='footer'>
            <Link href='/'>Home</Link>
            <Link href='/contact'>Contact</Link>
        </div>
    )
}