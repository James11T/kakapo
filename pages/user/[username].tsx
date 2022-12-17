import React from "react";
import { Title } from "../../components/generic";
import { useRouter } from "next/router";
import type { NextPage } from "next";

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  const title = String(username ?? "User") + "'s profile";

  return (
    <>
      <Title title={title} />
    </>
  );
};

export default UserProfilePage;
