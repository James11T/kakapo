import { validate } from "../schemas/validation";
import {
  createUserSchema,
  getFriendRequestsSchema,
  getFriendsSchema,
  getUserSchema,
  isUsernameAvailableSchema,
  queryUsersSchema,
  removeFriendSchema,
  sendFriendRequestSchema,
} from "../schemas/users.schemas";
import type { Request, Response, NextFunction } from "express";

// get /
// Query users
const queryUsers = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(queryUsersSchema, req);
};

// post /
// Create user
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(createUserSchema, req);
};

// get /:username
// Get user by username
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(getUserSchema, req);
};

// get /:username/is-available
// Is username available
const isUsernameAvailable = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(isUsernameAvailableSchema, req);
};

// get /:username/friends
// Get users friends
const getFriends = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(getFriendsSchema, req);
};

// delete /:username/friends/:friendUsername
// Remove a friend frm a user
const removeFriend = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(removeFriendSchema, req);
};

// get /:username/friend-requests
// Get friend requests
const getFriendRequests = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(getFriendRequestsSchema, req);
};

// post /:username/friend-requests
// Send friend request
const sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(sendFriendRequestSchema, req);
};

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
