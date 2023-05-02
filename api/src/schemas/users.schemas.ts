import { z } from "zod";
import { pagination, username, password } from "./generic.schemas";

// get /
// Query users
const queryUsersSchema = z.object({
  query: z
    .object({
      username: z.string(),
    })
    .merge(pagination),
});

// post /
// Create user
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username,
    password,
  }),
});

// get /:username
// Get user by username
const getUserSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

// get /:username/is-available
// Is username available
const isUsernameAvailableSchema = z.object({
  params: z.object({ username: z.string() }),
});

// get /:username/friends
// Get users friends
const getFriendsSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
  query: pagination,
});

// delete /:username/friends/:friendUsername
// Remove a friend frm a user
const removeFriendSchema = z.object({
  params: z.object({
    username: z.string(),
    friendUsername: z.string(),
  }),
});

// get /:username/friend-requests
// Get friend requests
const getFriendRequestsSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
  query: z
    .object({
      direction: z.enum(["incoming", "outgoing"]).default("incoming"),
    })
    .merge(pagination),
});

// post /:username/friend-requests
// Send friend request
const sendFriendRequestSchema = z.object({
  params: z.object({ username: z.string() }),
});

const publicUserFilterSchema = z.object({
  uuid: z.any(),
  username: z.any(),
  displayName: z.any(),
  avatar: z.any(),
  about: z.any(),
  registeredAt: z.any(),
});

const privateUserFilterSchema = z
  .object({
    email: z.any(),
    emailVerified: z.any(),
  })
  .merge(publicUserFilterSchema);

export {
  queryUsersSchema,
  createUserSchema,
  getUserSchema,
  isUsernameAvailableSchema,
  getFriendsSchema,
  removeFriendSchema,
  getFriendRequestsSchema,
  sendFriendRequestSchema,
  publicUserFilterSchema,
  privateUserFilterSchema,
};
