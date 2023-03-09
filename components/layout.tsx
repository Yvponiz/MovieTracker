import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import commonProps, { GreetingProps } from "../utils/commonProps";
import Footer from "./footer";
import Header from "./header";

type LayoutProps = {
  children: ReactElement[],
  isLoggedIn: boolean,
};

export default function Layout({ children, isLoggedIn, username }: LayoutProps & any) {
  return (
    <>
      <Head>
        <title>Movie Tracker</title>
        <meta name="description" content="Track movies & series you want to see" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Header isLoggedIn={isLoggedIn} />
        {children}
        <Footer />
      </div>
    </>);
}
