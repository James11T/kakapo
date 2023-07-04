import { APIConflictError, APIForbiddenError } from "../errors.js";
import { protect } from "../middleware/auth.middleware.js";
import { friendRequestPublicSchema, publicUserFilterSchema } from "../schemas/users.schemas.js";
import {
  createUserSchema,
  getFriendRequestsSchema,
  getFriendsSchema,
  getUserSchema,
  isUsernameAvailableSchema,
  queryUsersSchema,
  removeFriendSchema,
  sendFriendRequestSchema,
  deleteFriendRequestSchema,
} from "../schemas/users.schemas.js";
import { validate } from "../schemas/validation.js";
import * as userService from "../services/user.service.js";
import { filter } from "../utils/objects.js";
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

// get /
// Query users
const queryUsers = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(queryUsersSchema, req);

  const users = await userService.queryUsers(parsedRequest.query);

  return res.json(users.map((user) => filter(user, publicUserFilterSchema)));
});

// post /
// Create user
const createUser = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(createUserSchema, req);

  const isUsernameAvailable = await userService.isUsernameAvailable(parsedRequest.body.username);
  if (!isUsernameAvailable)
    return next(
      new APIConflictError("USERNAME_RESERVED", "The username provided is taken or reserved")
    );

  const user = await userService.createUser(
    parsedRequest.body.username,
    parsedRequest.body.email,
    parsedRequest.body.password
  );

  return res.json({ uuid: user.uuid });
});

// get /:username
// Get user by username
const getUser = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getUserSchema, req);

  const user = await userService.getUser({ username: parsedRequest.params.username });

  return res.json(filter(user, publicUserFilterSchema));
});

// get /:username/is-available
// Is username available
const isUsernameAvailable = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedRequest = await validate(isUsernameAvailableSchema, req);

    const available = await userService.isUsernameAvailable(parsedRequest.params.username);

    return res.json({ available });
  }
);

// get /:username/friends
// Get users friends
const getFriends = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getFriendsSchema, req);

  const friends = await userService.getUserFriends(
    { username: parsedRequest.params.username },
    parsedRequest.query
  );

  return res.json(friends.map((user) => filter(user, publicUserFilterSchema)));
});

// delete /:username/friends/:friendUsername
// Remove a friend from a user
const removeFriend = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(removeFriendSchema, req);

  const subject = await userService.getUser({ username: parsedRequest.params.username });

  if (subject.id !== req.user.id)
    return next(
      new APIForbiddenError(
        "FORBIDDEN",
        "You do not have permission to remove this user as a friend from this user"
      )
    );

  await userService.removeUserFriendship(subject, {
    username: parsedRequest.params.friendUsername,
  });

  return res.sendStatus(204);
});

// get /:username/friend-requests
// Get friend requests
const getFriendRequests = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(getFriendRequestsSchema, req);

    // Investigate better way of doing this
    if (parsedRequest.params.username !== req.user.username) {
      return next(
        new APIForbiddenError("FORBIDDEN", "You can only retrieve your own friend requests.")
      );
    }

    const friendRequests = await userService.getUserFriendRequests(
      { username: parsedRequest.params.username },
      parsedRequest.query
    );

    return res.json(
      friendRequests.map((friendRequest) =>
        filter(
          {
            ...friendRequest,
            user: friendRequest.userFrom ?? friendRequest.userTo,
          },
          friendRequestPublicSchema
        )
      )
    );
  }
);

// post /:username/friend-requests
// Send friend request
const sendFriendRequest = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(sendFriendRequestSchema, req);

    const from = req.user;
    const to = await userService.getUser({ username: parsedRequest.params.username });

    const newFriendRequest = await userService.createFriendRequest(from, to);

    return res.json(filter(newFriendRequest, friendRequestPublicSchema));
  }
);

const deleteFriendRequest = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(deleteFriendRequestSchema, req);

    const friendRequest = await userService.getFriendRequest(parsedRequest.params.friendRequestId);

    // Friend request is not from or to this current user
    if (friendRequest.userFromId !== req.user.id && friendRequest.userToId !== req.user.id)
      return next(
        new APIForbiddenError(
          "FORBIDDEN",
          "You do not have permission to delete this friend request"
        )
      );

    await userService.deleteFriendRequest(friendRequest);

    return res.sendStatus(204);
  }
);

export {
  queryUsers,
  createUser,
  getUser,
  isUsernameAvailable,
  getFriends,
  removeFriend,
  getFriendRequests,
  sendFriendRequest,
  deleteFriendRequest,
};
