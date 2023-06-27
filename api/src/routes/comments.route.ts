import { Router } from "express";
import {
  queryComments,
  createPostComment,
  getComment,
  editComment,
  deleteComment,
  getCommentLikes,
  likeComment,
  unlikeComment,
} from "../controllers/comments.controller.js";

const commentsRouter = Router();

commentsRouter.get("/", queryComments); // Get comments on a post
commentsRouter.post("/", createPostComment); // Create a comment on a post

commentsRouter.get("/:commentId", getComment); // Get a specific comment
commentsRouter.patch("/:commentId", editComment); // Edit a comment
commentsRouter.delete("/:commentId", deleteComment); // Delete a comment

commentsRouter.get("/:commentId/likes", getCommentLikes); // Get a comments like count
commentsRouter.post("/:commentId/likes", likeComment); // Like a comment
commentsRouter.delete("/:commentId/likes", unlikeComment); // Unlike a comment

export default commentsRouter;
