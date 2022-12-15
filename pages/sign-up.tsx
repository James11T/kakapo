import React from "react";
import { Title } from "../components/generic";
import { SignUp } from "../components/constructed";
import type { NextPage } from "next";

const SignUpPage: NextPage = () => {
  return (
    <>
      <Title title="Sign Up" />
      <SignUp />
    </>
  );
};

export default SignUpPage;
