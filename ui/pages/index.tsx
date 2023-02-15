import React from "react";
import { Title } from "../components/generic";
import useToasts from "../hooks/useToasts";
import useAPI from "../hooks/useAPI";
import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const API = useAPI();
  const toasts = useToasts();

  React.useEffect(() => {
    API.status().then((response) => {
      if (response.err) {
        if (response.http) {
          toasts.create("API unavailable", { color: "_destructive" });
        } else if (response.network) {
          toasts.create("API unreachable", { color: "_destructive" });
        }
      } else if (process.env.NODE_ENV === "development") {
        toasts.create("API online", { color: "_success" });
      }
    });
  }, []);

  return (
    <>
      <Title title="Home" />
      <Link href="/sign-in">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
      <Link href="/user/uisignin">User</Link>
    </>
  );
};

export default Home;
