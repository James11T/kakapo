import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Kakapo | Home</title>
        <meta name="description" content="Kakapo UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Hello World!</div>
    </div>
  );
};

export default Home;
