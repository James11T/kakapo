import React from "react";
import Head from "next/head";
import { TextInput, PasswordInput, Button, Card } from "../components";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const handleClick = (): void => console.log("click");

  return (
    <div style={{ width: 500, marginInline: "auto", marginTop: 200 }}>
      <Head>
        <title>Kakapo | Home</title>
        <meta name="description" content="Kakapo UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card className={{ a: true }} flexDirection="col">
        <TextInput id="email" label="Email" />
        <PasswordInput id="password" label="Password" />
        <Button
          id="password1"
          fullWidth={true}
          type="primary"
          onClick={handleClick}
        >
          Primary Button
        </Button>
        <Button
          id="password2"
          fullWidth={true}
          type="secondary"
          onClick={handleClick}
        >
          Secondary Button
        </Button>
        <Button
          id="password3"
          fullWidth={true}
          type="destructive"
          onClick={handleClick}
        >
          Destructive Button
        </Button>
        <Button
          id="password1"
          fullWidth={true}
          type="primary"
          disabled={true}
          onClick={handleClick}
        >
          Disabled
        </Button>
      </Card>
    </div>
  );
};

export default Home;
