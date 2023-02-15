import React from "react";
import { Title, Box, FlexPusher } from "../../components/generic";
import { serverAPI } from "../../api/api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { User } from "../../api/types";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage
} from "next";
import styles from "../../styles/pages/user.module.scss";

interface UserProfilePageProps {
  user?: User;
  errorCode?: number;
}

const UserProfilePage: NextPage<UserProfilePageProps> = ({
  user,
  errorCode
}: UserProfilePageProps): JSX.Element => {
  if (user) {
    return (
      <>
        <Title title={`${user.username}'s profile`} />
        <Box flex="row" fullWidth={true} spacing={2} padding={2}>
          <img
            className={styles["user-page__avatar"]}
            src="/default_avatar.png"
            alt={`${user.username}'s avatar`}
          />
          <Box>
            <h1>{user.displayName}</h1>
            <span>@{user.username}</span>
          </Box>
          <FlexPusher />
          <Box>
            <MoreVertIcon />
          </Box>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Title title="Error" />
        <Box>{errorCode}</Box>
      </>
    );
  }
};

const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<UserProfilePageProps>> => {
  const { username } = context.query;

  if (!username) return { props: {} };

  const response = await serverAPI.getUser(String(username));

  if (response.err) return { props: {} };

  return {
    props: {
      user: response.data
    }
  };
};

export default UserProfilePage;
export { getServerSideProps };
