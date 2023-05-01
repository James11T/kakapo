import { validate } from "../schemas/validation";
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
} from "../schemas/posts.schemas";
import type { Request, Response, NextFunction } from "express";

// get /
// Query posts
const queryPosts = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(queryPostsSchema, req);
};

// post /
// Create a post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(createPostSchema, req);
};

// get /:postId
// Get a post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getPostSchema, req);
};

// patch /:postId
// Edit a post
const editPost = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(editPostSchema, req);
};

// delete /:postId
// Delete a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(deletePostSchema, req);
};

// get /:postId/likes
// Get like count on a post
const getPostLikes = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getPostLikesSchema, req);
};

// post /:postId/likes
// Like a post
const likePost = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(likePostSchema, req);
};

// delete /:postId/likes
// Unlike a post
const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(unlikePostSchema, req);
};

// get /:postId/comments
// Get comments on a post
const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getPostCommentsSchema, req);
};

// post /:postId/comments
// Create a comment on a post
const createPostComment = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(createPostCommentSchema, req);
};

// get /:postId/comments/:commentId
// Get a specific comment
const getComment = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getCommentSchema, req);
};

// patch /:postId/comments/:commentId
// Edit a comment
const editComment = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(editCommentSchema, req);
};

// delete /:postId/comments/:commentId
// Delete a comment
const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(deleteCommentSchema, req);
};

// get /:postId/comments/:commentId/likes
// Get a comments like count
const getCommentLikes = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getCommentLikesSchema, req);
};

// post /:postId/comments/:commentId/likes
// Like a comment
const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(likeCommentSchema, req);
};

// delete /:postId/comments/:commentId/likes
// Unlike a comment
const unlikeComment = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(unlikeCommentSchema, req);
};

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
