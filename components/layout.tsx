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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600&family=Signika+Negative:wght@700&display=swap" rel="stylesheet"></link>
      </Head>

      <div className="layout">
        <Header />
        {children}
        <Footer />
      </div>
    </>);
}
