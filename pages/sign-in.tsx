import React from "react";
import { Title } from "../components/generic";
import { SignIn } from "../components/constructed";

import type { NextPage } from "next";

const SignInPage: NextPage = () => {
  return (
    <>
      <Title title="Sign In" />
      <SignIn />
    </>
  );
};

export default SignInPage;
