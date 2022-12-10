import React from "react";
import { Title } from "../components/generic";
import { NavBar, SignIn } from "../components/constructed";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Title title="Home" />
      <NavBar />
      <SignIn />
    </>
  );
};

export default Home;
