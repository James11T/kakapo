import { protect } from "../middleware/auth.middleware.js";
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
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

// get /
// Query users
const queryUsers = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(queryUsersSchema, req);
});

// post /
// Create user
const createUser = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(createUserSchema, req);
});

// get /:username
// Get user by username
const getUser = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getUserSchema, req);
});

// get /:username/is-available
// Is username available
const isUsernameAvailable = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedRequest = await validate(isUsernameAvailableSchema, req);
  }
);

// get /:username/friends
// Get users friends
const getFriends = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getFriendsSchema, req);
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
