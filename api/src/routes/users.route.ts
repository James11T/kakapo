import { Router } from "express";
import {
  queryUsers,
  createUser,
  getUser,
  isUsernameAvailable,
  getFriends,
  removeFriend,
  getFriendRequests,
  sendFriendRequest,
  deleteFriendRequest,
} from "../controllers/users.controllers.js";

const usersRouter = Router();

usersRouter.get("/", queryUsers); // Query users
usersRouter.post("/", createUser); // Create user

usersRouter.get("/:username", getUser); // Get user by username
usersRouter.get("/:username/is-available", isUsernameAvailable); // Is username available

usersRouter.get("/:username/friends", getFriends); // Get users friends
usersRouter.delete("/:username/friends/:friendUsername", removeFriend); // Remove a friend frm a user

usersRouter.get("/:username/friend-requests", getFriendRequests); // Get friend requests
usersRouter.post("/:username/friend-requests", sendFriendRequest); // Send friend request
usersRouter.delete("/:username/friend-requests", deleteFriendRequest); // Delete friend request

export default usersRouter;
