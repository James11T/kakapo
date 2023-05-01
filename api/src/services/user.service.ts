import { Err, Ok } from "../errors/errorHandling";
import prisma from "../database";
import type { FriendshipStatus, AsyncResult, RequireKey } from "../types";
import type { FriendRequest, Friendship, User } from "@prisma/client";

type ID = number;
type UUID = string;
type Username = string;
type UniqueUserKeys = { id: ID; uuid: UUID; username: Username };
type UniqueUser = RequireKey<UniqueUserKeys>;

const getUserByUnique = async (user: UniqueUser): Promise<User | null> => {
  const dbUser = await prisma.user.findUnique({
    where: {
      ...(user.id && { id: user.id }),
      ...(user.uuid && { uuid: user.uuid }),
      ...(user.username && { username: user.username }),
    },
  });

  return dbUser;
};

const resolveID = async (user: UniqueUser): AsyncResult<ID, "UNKNOWN_USER"> => {
  if (user.id) return Ok(user.id);

  const dbUser = await getUserByUnique(user);
  if (dbUser) return Ok(dbUser.id);
  return Err("UNKNOWN_USER");
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
): AsyncResult<Friendship | null, "UNKNOWN_USER"> => {
  const user1Id = await resolveID(user1);
  const user2Id = await resolveID(user2);

  if (user1Id.err || user2Id.err) return Err("UNKNOWN_USER");
  const [firstUser, secondUser] = orderUsersByID({ id: user1Id.val }, { id: user2Id.val });

  const friendship = await prisma.friendship.findUnique({
    where: {
      user1Id_user2Id: {
        user1Id: firstUser.id,
        user2Id: secondUser.id,
      },
    },
  });

  return Ok(friendship);
};

const getUserFriendRequests = async (
  user: UniqueUser,
  direction: "incoming" | "outgoing" = "incoming"
): AsyncResult<FriendRequest[], "UNKNOWN_USER"> => {
  const user1Id = await resolveID(user);
  if (user1Id.err) return user1Id;

  const key = direction === "incoming" ? "userToId" : "userFromId";

  const friendRequests = await prisma.friendRequest.findMany({
    where: {
      [key]: user1Id.val,
    },
  });

  return Ok(friendRequests);
};

const getUsersFriendshipState = async (
  user1: UniqueUser,
  user2: UniqueUser
): AsyncResult<FriendshipStatus, "UNKNOWN_USER"> => {
  const user1Id = await resolveID(user1);
  const user2Id = await resolveID(user2);

  if (user1Id.err) return user1Id;
  if (user2Id.err) return user2Id;

  const friendship = await getUserFriendship({ id: user1Id.val }, { id: user2Id.val });
  if (friendship) return Ok("FRIENDS");

  const friendRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { userFromId: user1Id.val, userToId: user2Id.val },
        { userFromId: user2Id.val, userToId: user1Id.val },
      ],
    },
  });

  if (friendRequest) return Ok("PENDING");

  return Ok("NOT_FRIENDS");
};

const isUsernameAvailable = async (username: string): AsyncResult<boolean, never> => {
  const user = await prisma.user.findUnique({ where: { username } });
  return Ok(Boolean(user));
};

const getUserFriends = async (user: UniqueUser): AsyncResult<User[], "UNKNOWN_USER"> => {
  const userId = await resolveID(user);
  if (userId.err) return userId;

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

  return Ok(friends);
};

export {
  getUserByUnique,
  getUserByID,
  getUserByUUID,
  getUserFriendRequests,
  isUsernameAvailable,
  getUsersFriendshipState,
};
