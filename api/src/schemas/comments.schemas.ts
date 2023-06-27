import { z } from "zod";
import { pagination } from "./generic.schemas.js";
import { publicUserFilterSchema } from "./users.schemas.js";

const commentText = z.string().min(1).max(1024);

// get /comments
// Get comments on a post
const queryCommentsSchema = z.object({
  params: z.object({}),
  query: z
    .object({
      postId: z.string(),
    })
    .merge(pagination),
});

// post /comments
// Create a comment on a post
const createPostCommentSchema = z.object({
  body: z.object({
    text: commentText,
    postId: z.string(),
  }),
});

// get /comments/:commentId
// Get a specific comment
const getCommentSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
});

// patch /comments/:commentId
// Edit a comment
const editCommentSchema = z.object({
  body: z.object({
    text: commentText,
  }),
  params: z.object({
    commentId: z.string(),
  }),
});

// delete /comments/:commentId
// Delete a comment
const deleteCommentSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
});

// get /comments/:commentId/likes
// Get a comments like count
const getCommentLikesSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
});

// post /comments/:commentId/likes
// Like a comment
const likeCommentSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
});

// delete /comments/:commentId/likes
// Unlike a comment
const unlikeCommentSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
});

const publicCommentFilterSchema = z.object({
  uuid: z.string(),
  text: z.string(),
  postedAt: z.date(),
  author: publicUserFilterSchema,
});

export {
  queryCommentsSchema,
  createPostCommentSchema,
  getCommentSchema,
  editCommentSchema,
  deleteCommentSchema,
  getCommentLikesSchema,
  likeCommentSchema,
  unlikeCommentSchema,
  publicCommentFilterSchema,
};
