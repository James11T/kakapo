import { protect } from "../middleware/auth.middleware.js";
import {
  createPostCommentSchema,
  createPostSchema,
  deleteCommentSchema,
  deletePostSchema,
  editCommentSchema,
  editPostSchema,
  getCommentLikesSchema,
  getCommentSchema,
  getPostCommentsSchema,
  getPostLikesSchema,
  getPostSchema,
  likeCommentSchema,
  likePostSchema,
  queryPostsSchema,
  unlikeCommentSchema,
  unlikePostSchema,
} from "../schemas/posts.schemas.js";
import { validate } from "../schemas/validation.js";
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

// get /
// Query posts
const queryPosts = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(queryPostsSchema, req);
});

// post /
// Create a post
const createPost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(createPostSchema, req);
});

// get /:postId
// Get a post
const getPost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getPostSchema, req);
});

// patch /:postId
// Edit a post
const editPost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(editPostSchema, req);
});

// delete /:postId
// Delete a post
const deletePost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(deletePostSchema, req);
});

// get /:postId/likes
// Get like count on a post
const getPostLikes = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getPostLikesSchema, req);
});

// post /:postId/likes
// Like a post
const likePost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(likePostSchema, req);
});

// delete /:postId/likes
// Unlike a post
const unlikePost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(unlikePostSchema, req);
});

// get /:postId/comments
// Get comments on a post
const getPostComments = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getPostCommentsSchema, req);
});

// post /:postId/comments
// Create a comment on a post
const createPostComment = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(createPostCommentSchema, req);
  }
);

// get /:postId/comments/:commentId
// Get a specific comment
const getComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getCommentSchema, req);
});

// patch /:postId/comments/:commentId
// Edit a comment
const editComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(editCommentSchema, req);
});

// delete /:postId/comments/:commentId
// Delete a comment
const deleteComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(deleteCommentSchema, req);
});

// get /:postId/comments/:commentId/likes
// Get a comments like count
const getCommentLikes = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getCommentLikesSchema, req);
});

// post /:postId/comments/:commentId/likes
// Like a comment
const likeComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(likeCommentSchema, req);
});

// delete /:postId/comments/:commentId/likes
// Unlike a comment
const unlikeComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(unlikeCommentSchema, req);
});

export {
  queryPosts,
  createPost,
  getPost,
  editPost,
  deletePost,
  getPostLikes,
  likePost,
  unlikePost,
  getPostComments,
  createPostComment,
  getComment,
  editComment,
  deleteComment,
  getCommentLikes,
  likeComment,
  unlikeComment,
};
