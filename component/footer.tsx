import { ReactElement } from "react";
import Link from "next/link";


type FooterProps = {
    [name: string]: ReactElement[]
};

export default function Footer({}: FooterProps) {
    return (
        <>
            <div className='footer'>
                <div className='footer-links'>
                    <Link href='/'>home</Link>
                </div>
            </div>
        </>
    )
}