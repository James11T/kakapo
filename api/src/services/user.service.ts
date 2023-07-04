import { DATA_CONSTANTS } from "../config.js";
import prisma from "../database.js";
import { APIBadRequestError, APIConflictError, APINotFoundError } from "../errors.js";
import { managePrismaError } from "../errors.js";
import logger from "../logging.js";
import { uuid } from "../utils/strings.js";
import * as passwordService from "./passwords.service.js";
import type { FriendshipStatus, Pagination, RequireKey, UUID, ID } from "../types.js";
import type { FriendRequest, Friendship, User } from "@prisma/client";

type UniqueUserKeys = { id: ID; uuid: UUID; username: string; email: string };
type UniqueUser = RequireKey<UniqueUserKeys> & Partial<User>;

const userNotFound = new APINotFoundError(
  "USER_NOT_FOUND",
  "No user was found that matches the given criteria"
);

const getUser = async (user: UniqueUser): Promise<User> => {
  try {
    const dbUser = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
        uuid: user.uuid,
        username: user.username,
        email: user.email,
      },
    });

    return dbUser;
  } catch (error) {
    return managePrismaError(error, userNotFound);
  }
};

const getUserID = async (user: UniqueUser): Promise<User["id"]> => {
  if (user.id) return user.id;

  const dbUser = await getUser(user);
  return dbUser.id;
};

const orderUsersByID = <T extends Pick<UniqueUserKeys, "id">>(user1: T, user2: T): [T, T] => {
  if (user1.id < user2.id) return [user1, user2];
  return [user2, user1];
};

const getUserFriendship = async (
  user1: UniqueUser,
  user2: UniqueUser
): Promise<Friendship | null> => {
  const user1Id = await getUserID(user1);
  const user2Id = await getUserID(user2);

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

interface GetUserFriendRequestsOptions extends Pagination {
  direction?: "incoming" | "outgoing";
}

const getUserFriendRequests = async (
  user: UniqueUser,
  options: GetUserFriendRequestsOptions
): Promise<(FriendRequest & { userFrom: User | undefined; userTo: User | undefined })[]> => {
  const user1Id = await getUserID(user);
  const direction = options.direction ?? "incoming";

  const key = direction === "incoming" ? "userToId" : "userFromId";

  const friendRequests = await prisma.friendRequest.findMany({
    where: {
      [key]: user1Id,
    },
    skip: options.from,
    take: options.count ?? DATA_CONSTANTS.PAGINATION_TAKE_DEFAULT,
    include: {
      userFrom: direction === "incoming",
      userTo: direction === "outgoing",
    },
  });

  return friendRequests;
};

const getUsersFriendshipState = async (
  user1: UniqueUser,
  user2: UniqueUser
): Promise<FriendshipStatus> => {
  const user1Id = await getUserID(user1);
  const user2Id = await getUserID(user2);

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
  return user === null;
};

const isEmailInUse = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user !== null;
};

const getUserFriends = async (user: UniqueUser, options: Pagination): Promise<User[]> => {
  const userId = await getUserID(user);

  const friends = await prisma.user.findMany({
    where: {
      OR: [
        {
          friendships1: {
            some: {
              user2Id: userId,
            },
          },
        },
        {
          friendships2: {
            some: {
              user1Id: userId,
            },
          },
        },
      ],
    },
    include: {
      friendships1: true,
      friendships2: true,
    },
    skip: options.from,
    take: options.count ?? DATA_CONSTANTS.PAGINATION_TAKE_DEFAULT,
  });

  return friends;
};

interface QueryOptions extends Pagination {
  username: string;
}

const queryUsers = async (options: QueryOptions): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: options.username,
          },
        },
        {
          displayName: {
            contains: options.username,
          },
        },
      ],
    },
    skip: options.from,
    take: options.count ?? DATA_CONSTANTS.PAGINATION_TAKE_DEFAULT,
  });

  return users;
};

const createUser = async (username: string, email: string, password: string) => {
  const emailInUse = await isEmailInUse(email);

  if (emailInUse)
    throw new APIConflictError("EMAIL_RESERVED", "The email provided is already in use");

  const passwordHash = await passwordService.hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      displayName: username,
      uuid: uuid(),
      registeredAt: new Date(),
    },
  });

  return user;
};

const hydrateUser = async <K extends keyof User>(user: UniqueUser, keys: K[]) => {
  if (keys.every((key) => Object.hasOwn(user, key))) return user as Pick<User, K>;

  logger.debug("Fetching for keys", { ID: "HYDRATE_USER_START", keys });

  const dbUser = await prisma.user.findUniqueOrThrow({
    where: user,
    select: Object.fromEntries(keys.map((key) => [key, true])) as Record<K, true>,
  });

  return dbUser;
};

const removeUserFriendship = async (user1: UniqueUser, user2: UniqueUser) => {
  const user1Id = await getUserID(user1);
  const user2Id = await getUserID(user2);

  const friendshipState = await getUsersFriendshipState(user1, user2);

  if (friendshipState !== "FRIENDS")
    throw new APIBadRequestError("NOT_FRIENDS", "This user is not friends with the given user");

  const [firstUser, secondUser] = orderUsersByID({ id: user1Id }, { id: user2Id });

  await prisma.friendship.delete({
    where: {
      user1Id_user2Id: {
        user1Id: firstUser.id,
        user2Id: secondUser.id,
      },
    },
  });
};

const removeUserFriendRequests = async (user1: UniqueUser, user2: UniqueUser) => {
  const user1Id = await getUserID(user1);
  const user2Id = await getUserID(user2);

  const [firstUser, secondUser] = orderUsersByID({ id: user1Id }, { id: user2Id });

  await prisma.friendRequest.deleteMany({
    where: {
      OR: [
        { userFromId: firstUser.id, userToId: secondUser.id },
        { userFromId: secondUser.id, userToId: firstUser.id },
      ],
    },
  });
};

const friendRequestNotFound = new APINotFoundError(
  "FRIEND_REQUEST_NOT_FOUND",
  "No friend request was found that matches the given criteria"
);

const getFriendRequest = async (uuid: string) => {
  try {
    const dbFriendRequest = await prisma.friendRequest.findUniqueOrThrow({
      where: {
        uuid,
      },
      include: {
        userFrom: true,
        userTo: true,
      },
    });

    return dbFriendRequest;
  } catch (error) {
    return managePrismaError(error, friendRequestNotFound);
  }
};

const deleteFriendRequest = async (friendRequest: Pick<FriendRequest, "uuid">) => {
  await prisma.friendRequest.delete({ where: { uuid: friendRequest.uuid } });
};

const createFriendRequest = async (from: UniqueUser, to: UniqueUser) => {
  const userFromId = await getUserID(from);
  const userToId = await getUserID(to);

  const friendshipState = await getUsersFriendshipState(from, to);

  if (friendshipState === "FRIENDS")
    throw new APIBadRequestError(
      "ALREADY_FRIENDS",
      "You cannot send friend requests to users you are already friends with"
    );

  const newFriendRequest = await prisma.friendRequest.create({
    data: {
      userFromId,
      userToId,
      sentAt: new Date(),
      uuid: uuid(),
    },
  });

  return newFriendRequest;
};

export {
  getUser,
  getUserFriendRequests,
  isUsernameAvailable,
  getUsersFriendshipState,
  getUserFriends,
  queryUsers,
  getUserID,
  isEmailInUse,
  createUser,
  hydrateUser,
  removeUserFriendship,
  removeUserFriendRequests,
  getFriendRequest,
  deleteFriendRequest,
  createFriendRequest,
};
export type { UniqueUser };
