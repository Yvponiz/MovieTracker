import Head from "next/head";
import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        <title>Movie Tracker</title>
        <meta name="description" content="Track movies you want to see" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Header />
        {children}
        <Footer />
      </div>
    </>);
}
