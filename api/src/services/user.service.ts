import prisma from "../database";
import { APINotFoundError } from "../errors";
import type { FriendshipStatus, RequireKey } from "../types";
import type { FriendRequest, Friendship, User } from "@prisma/client";

type ID = number;
type UUID = string;
type Username = string;
type UniqueUserKeys = { id: ID; uuid: UUID; username: Username; email: string };
type UniqueUser = RequireKey<UniqueUserKeys>;

const userNotFound = new APINotFoundError(
  "USER_NOT_FOUND",
  "No user was found that matches the given criteria"
);

const getUserByUnique = async (user: UniqueUser): Promise<User> => {
  const dbUser = await prisma.user.findUnique({
    where: {
      ...(user.id && { id: user.id }),
      ...(user.uuid && { uuid: user.uuid }),
      ...(user.username && { username: user.username }),
      ...(user.email && { email: user.email }),
    },
  });

  if (!dbUser) {
    throw userNotFound;
  }

  return dbUser;
};

const resolveID = async (user: UniqueUser): Promise<ID> => {
  if (user.id) return user.id;

  const dbUser = await getUserByUnique(user);
  return dbUser.id;
};

const getUserByID = async (id: ID) => await getUserByUnique({ id });
const getUserByUUID = async (uuid: UUID) => await getUserByUnique({ uuid });

const orderUsersByID = <T extends Pick<UniqueUserKeys, "id">>(user1: T, user2: T): [T, T] => {
  if (user1.id < user2.id) return [user1, user2];
  return [user2, user1];
};

const getUserFriendship = async (
  user1: UniqueUser,
  user2: UniqueUser
): Promise<Friendship | null> => {
  const user1Id = await resolveID(user1);
  const user2Id = await resolveID(user2);

  const [firstUser, secondUser] = orderUsersByID({ id: user1Id }, { id: user2Id });

  const friendship = await prisma.friendship.findUnique({
    where: {
      user1Id_user2Id: {
        user1Id: firstUser.id,
        user2Id: secondUser.id,
      },
    },
  });

  return friendship;
};

const getUserFriendRequests = async (
  user: UniqueUser,
  direction: "incoming" | "outgoing" = "incoming"
): Promise<FriendRequest[]> => {
  const user1Id = await resolveID(user);

  const key = direction === "incoming" ? "userToId" : "userFromId";

  const friendRequests = await prisma.friendRequest.findMany({
    where: {
      [key]: user1Id,
    },
  });

  return friendRequests;
};

const getUsersFriendshipState = async (
  user1: UniqueUser,
  user2: UniqueUser
): Promise<FriendshipStatus> => {
  const user1Id = await resolveID(user1);
  const user2Id = await resolveID(user2);

  const friendship = await getUserFriendship({ id: user1Id }, { id: user2Id });
  if (friendship) return "FRIENDS";

  const friendRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { userFromId: user1Id, userToId: user2Id },
        { userFromId: user2Id, userToId: user1Id },
      ],
    },
  });

  if (friendRequest) return "PENDING";

  return "NOT_FRIENDS";
};

const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { username } });
  return Boolean(user);
};

const getUserFriends = async (user: UniqueUser): Promise<User[]> => {
  const userId = await resolveID(user);

  const friends = await prisma.user.findMany({
    where: {
      OR: [
        {
          friendships1: {
            some: {
              user2Id: user.id,
            },
          },
        },
        {
          friendships2: {
            some: {
              user1Id: user.id,
            },
          },
        },
      ],
    },
    include: {
      friendships1: true,
      friendships2: true,
    },
  });

  return friends;
};

export {
  getUserByUnique,
  getUserByID,
  getUserByUUID,
  getUserFriendRequests,
  isUsernameAvailable,
  getUsersFriendshipState,
  getUserFriends,
};
