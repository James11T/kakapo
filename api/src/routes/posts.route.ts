import { Router } from "express";
import { POST_CONSTANTS } from "../config.js";
import {
  queryPosts,
  createPost,
  getPost,
  editPost,
  deletePost,
  getPostLikes,
  likePost,
  unlikePost,
} from "../controllers/posts.controller.js";

const postsRouter = Router();

postsRouter.get("/", queryPosts); // Query posts
postsRouter.post("/", createPost); // Create a post

postsRouter.get("/:postId", getPost); // Get a post
postsRouter.patch("/:postId", editPost); // Edit a post
postsRouter.delete("/:postId", deletePost); // Delete a post

postsRouter.get("/:postId/likes", getPostLikes); // Get like count on a post
postsRouter.post("/:postId/likes", likePost); // Like a post
postsRouter.delete("/:postId/likes", unlikePost); // Unlike a post

export default postsRouter;
