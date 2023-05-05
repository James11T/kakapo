import { z } from "zod";
import { pagination } from "./generic.schemas.js";

const postCaption = z.string().min(1).max(1024);
const commentText = z.string().min(1).max(1024);

// get /
// Query posts
const queryPostsSchema = z.object({
  query: z
    .object({
      caption: z.string(),
      "order-by": z
        .enum(["likes-asc", "likes-desc", "posted-asc", "posted-desc"])
        .default("likes-desc"),
    })
    .merge(pagination),
});

// post /
// Create a post
// TODO: FORM-DATA
const createPostSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});

// get /:postId
// Get a post
const getPostSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
});

// patch /:postId
// Edit a post
const editPostSchema = z.object({
  body: z.object({
    caption: postCaption,
  }),
  params: z.object({
    postId: z.string().uuid(),
  }),
});

// delete /:postId
// Delete a post
const deletePostSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
});

// get /:postId/likes
// Get like count on a post
const getPostLikesSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
});

// post /:postId/likes
// Like a post
const likePostSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
});

// delete /:postId/likes
// Unlike a post
const unlikePostSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
});

// get /:postId/comments
// Get comments on a post
const getPostCommentsSchema = z.object({
  body: z.object({}),
  params: z.object({
    postId: z.string().uuid(),
  }),
  query: z.object({}),
});

// post /:postId/comments
// Create a comment on a post
const createPostCommentSchema = z.object({
  body: z.object({
    text: commentText,
  }),
  params: z.object({
    postId: z.string().uuid(),
  }),
});

// get /:postId/comments/:commentId
// Get a specific comment
const getCommentSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
    commentId: z.string().uuid(),
  }),
});

// patch /:postId/comments/:commentId
// Edit a comment
const editCommentSchema = z.object({
  body: z.object({
    text: commentText,
  }),
  params: z.object({
    postId: z.string().uuid(),
    commentId: z.string().uuid(),
  }),
});

// delete /:postId/comments/:commentId
// Delete a comment
const deleteCommentSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
    commentId: z.string().uuid(),
  }),
});

// get /:postId/comments/:commentId/likes
// Get a comments like count
const getCommentLikesSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
    commentId: z.string().uuid(),
  }),
});

// post /:postId/comments/:commentId/likes
// Like a comment
const likeCommentSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
    commentId: z.string().uuid(),
  }),
});

// delete /:postId/comments/:commentId/likes
// Unlike a comment
const unlikeCommentSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
    commentId: z.string().uuid(),
  }),
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
  getPostCommentsSchema,
  createPostCommentSchema,
  getCommentSchema,
  editCommentSchema,
  deleteCommentSchema,
  getCommentLikesSchema,
  likeCommentSchema,
  unlikeCommentSchema,
};
