import { APIConflictError, APIUnauthorizedError } from "../errors.js";
import { protect } from "../middleware/auth.middleware.js";
import { publicUserFilterSchema } from "../schemas/users.schemas.js";
import {
  createUserSchema,
  getFriendRequestsSchema,
  getFriendsSchema,
  getUserSchema,
  isUsernameAvailableSchema,
  queryUsersSchema,
  removeFriendSchema,
  sendFriendRequestSchema,
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

  const isEmailInUse = await userService.isEmailInUse(parsedRequest.body.email);
  if (isEmailInUse)
    return next(new APIConflictError("EMAIL_RESERVED", "The email provided is already in use"));

  // TODO: Add email verification

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
// Remove a friend frm a user
const removeFriend = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(removeFriendSchema, req);
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
        new APIUnauthorizedError("UNAUTHORIZED", "You can only retrieve your own friend requests.")
      );
    }

    const friendRequests = await userService.getUserFriendRequests(
      { username: parsedRequest.params.username },
      parsedRequest.query
    );

    return res.json(
      friendRequests.map((friendRequest) => ({
        sentAt: friendRequest.sentAt,
        user: filter(friendRequest.userFrom ?? friendRequest.userTo, publicUserFilterSchema),
      }))
    );
  }
);

// post /:username/friend-requests
// Send friend request
const sendFriendRequest = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(sendFriendRequestSchema, req);
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
};
