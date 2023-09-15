import { z } from "zod";
import { pagination, username } from "./generic.schemas.js";

// get /
// Query users
const queryUsersSchema = z.object({
  query: z
    .object({
      username: z.string(),
    })
    .merge(pagination),
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

// post /:uuid/initiate
// Initiate a user
const initiateUserSchema = z.object({
  params: z.object({
    uuid: z.string(),
  }),
  body: z.object({
    username,
  }),
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

const deleteFriendRequestSchema = z.object({
  params: z.object({
    friendRequestId: z.string(),
  }),
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

const friendRequestPublicSchema = z.object({
  sentAt: z.any(),
  uuid: z.any(),
  user: publicUserFilterSchema,
});

export {
  queryUsersSchema,
  getUserSchema,
  isUsernameAvailableSchema,
  initiateUserSchema,
  getFriendsSchema,
  removeFriendSchema,
  getFriendRequestsSchema,
  sendFriendRequestSchema,
  deleteFriendRequestSchema,
  publicUserFilterSchema,
  privateUserFilterSchema,
  friendRequestPublicSchema,
};
