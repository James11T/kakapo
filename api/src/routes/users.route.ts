import { Router } from "express";
import {
  queryUsers,
  getUser,
  isUsernameAvailable,
  initiateUser,
  getFriends,
  removeFriend,
  getFriendRequests,
  sendFriendRequest,
  deleteFriendRequest,
} from "../controllers/users.controllers.js";

const usersRouter = Router();

usersRouter.get("/", queryUsers); // Query users

usersRouter.get("/:username", getUser); // Get user by username
usersRouter.get("/:username/is-available", isUsernameAvailable); // Is username available

usersRouter.post("/:uuid/initiate", initiateUser); // Initiate user by uuid

usersRouter.get("/:username/friends", getFriends); // Get users friends
usersRouter.delete("/:username/friends/:friendUsername", removeFriend); // Remove a friend frm a user

usersRouter.get("/:username/friend-requests", getFriendRequests); // Get friend requests
usersRouter.post("/:username/friend-requests", sendFriendRequest); // Send friend request
usersRouter.delete("/:username/friend-requests", deleteFriendRequest); // Delete friend request

export default usersRouter;
