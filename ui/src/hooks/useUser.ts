import { useQuery } from "@tanstack/react-query";
import { User } from "../types";

type UseUserConfig =
  | {
      uuid: string;
      username?: never;
    }
  | {
      username: string;
      uuid?: never;
    };

const getUserFromUsername = async (username: string): Promise<User> => {
  // TODO: DO

  return {
    uuid: "7d0d564a-a44d-4cb6-88bd-3319ed8bc299",
    username,
    displayName: username.toUpperCase(),
    about: "",
    registeredAt: new Date(),
  };
};

const getUserFromUUID = async (uuid: string): Promise<User> => {
  // TODO: DO

  return {
    uuid,
    username: "john.smith1",
    displayName: "John Smith",
    about: "",
    registeredAt: new Date(),
  };
};

const useUser = (config: UseUserConfig) => {
  const query = useQuery({
    queryKey: ["USER_QUERY", config.username, config.uuid],
    queryFn: () =>
      typeof config.username === "string"
        ? getUserFromUsername(config.username)
        : getUserFromUUID(config.uuid),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return query;
};

export default useUser;
