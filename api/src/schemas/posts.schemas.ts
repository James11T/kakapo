import { z } from "zod";
import { POST_CONSTANTS } from "../config.js";
import { pagination } from "./generic.schemas.js";
import { publicUserFilterSchema } from "./users.schemas.js";

const postCaption = z.string().min(1).max(1024);

// get /
// Query posts
const queryPostsSchema = z.object({
  query: z
    .object({
      caption: z.string().optional(),
      username: z.string().optional(),
      "order-by": z.enum(["likes", "posted-at"]).default("posted-at").optional(),
      "order-direction": z.enum(["asc", "desc"]).default("desc").optional(),
    })
    .merge(pagination),
});

// post /
// Create a post
const createPostSchema = z.object({
  body: z.object({
    caption: z.string().min(1).max(1024),
    media: z.array(z.number().min(0).max(POST_CONSTANTS.MAX_MEDIA_SIZE)),
  }),
});

// get /:postId
// Get a post
const getPostSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

// patch /:postId
// Edit a post
const editPostSchema = z.object({
  body: z.object({
    caption: postCaption,
  }),
  params: z.object({
    postId: z.string(),
  }),
});

// delete /:postId
// Delete a post
const deletePostSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

// get /:postId/likes
// Get like count on a post
const getPostLikesSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

// post /:postId/likes
// Like a post
const likePostSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

// delete /:postId/likes
// Unlike a post
const unlikePostSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

const postMediaFilterSchema = z.object({
  uuid: z.string(),
  url: z.string(),
  type: z.string(),
  index: z.number(),
  blocked: z.boolean(),
  restricted: z.boolean(),
  processed: z.boolean(),
});

const publicPostFilterSchema = z.object({
  uuid: z.string(),
  caption: z.string(),
  postedAt: z.date(),
  author: publicUserFilterSchema.optional(),
  media: z.array(postMediaFilterSchema).optional(),
});

export {
  queryPostsSchema,
  createPostSchema,
  getPostSchema,
  editPostSchema,
  deletePostSchema,
  getPostLikesSchema,
  likePostSchema,
  unlikePostSchema,
  publicPostFilterSchema,
};
