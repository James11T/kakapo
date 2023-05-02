import { Router } from "express";
import fileUpload from "express-fileupload";
import { POST_CONSTANTS } from "../config";
import {
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
} from "../controllers/posts.controller";

const postsRouter = Router();

postsRouter.get("/", queryPosts); // Query posts
postsRouter.post(
  "/",
  fileUpload({
    limits: {
      files: POST_CONSTANTS.MAX_MEDIA_COUNT,
      fileSize: POST_CONSTANTS.MAX_MEDIA_SIZE,
    },
  }),
  createPost
); // Create a post

postsRouter.get("/:postId", getPost); // Get a post
postsRouter.patch("/:postId", editPost); // Edit a post
postsRouter.delete("/:postId", deletePost); // Delete a post

postsRouter.get("/:postId/likes", getPostLikes); // Get like count on a post
postsRouter.post("/:postId/likes", likePost); // Like a post
postsRouter.delete("/:postId/likes", unlikePost); // Unlike a post

postsRouter.get("/:postId/comments", getPostComments); // Get comments on a post
postsRouter.post("/:postId/comments", createPostComment); // Create a comment on a post

postsRouter.get("/:postId/comments/:commentId", getComment); // Get a specific comment
postsRouter.patch("/:postId/comments/:commentId", editComment); // Edit a comment
postsRouter.delete("/:postId/comments/:commentId", deleteComment); // Delete a comment

postsRouter.get("/:postId/comments/:commentId/likes", getCommentLikes); // Get a comments like count
postsRouter.post("/:postId/comments/:commentId/likes", likeComment); // Like a comment
postsRouter.delete("/:postId/comments/:commentId/likes", unlikeComment); // Unlike a comment

export default postsRouter;
