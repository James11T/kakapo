import { APIForbiddenError } from "../errors.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  createPostCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
  getCommentLikesSchema,
  getCommentSchema,
  queryCommentsSchema,
  likeCommentSchema,
  publicCommentFilterSchema,
  unlikeCommentSchema,
} from "../schemas/comments.schemas.js";
import { validate } from "../schemas/validation.js";
import * as commentsService from "../services/comments.service.js";
import * as postService from "../services/post.service.js";
import { filter } from "../utils/objects.js";
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

// get /
// Get comments on a post
const queryComments = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(queryCommentsSchema, req);

  const comments = await commentsService.queryComments({
    post: { uuid: parsedRequest.query.postId },
  });

  return res.json(comments.map((comment) => filter(comment, publicCommentFilterSchema)));
});

// post /
// Create a comment on a post
const createPostComment = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(createPostCommentSchema, req);

    const post = await postService.getPost({ uuid: parsedRequest.body.postId });

    const comment = await commentsService.createComment(post, req.user, parsedRequest.body.text);

    return res.json(filter(comment, publicCommentFilterSchema));
  }
);

// get /:commentId
// Get a specific comment
const getComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getCommentSchema, req);

  const comment = await commentsService.getComment({ uuid: parsedRequest.params.commentId });

  return res.json(filter(comment, publicCommentFilterSchema));
});

// patch /:commentId
// Edit a comment
const editComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(editCommentSchema, req);

  const comment = await commentsService.getComment({ uuid: parsedRequest.params.commentId });

  if (comment.authorId !== req.user.id)
    return next(
      new APIForbiddenError("FORBIDDEN", "You do not have permission to edit this comment")
    );

  const newComment = await commentsService.editComment(comment, parsedRequest.body.text);

  return res.json(filter(newComment, publicCommentFilterSchema));
});

// delete /:commentId
// Delete a comment
const deleteComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(deleteCommentSchema, req);

  const comment = await commentsService.getComment({ uuid: parsedRequest.params.commentId });

  if (comment.authorId !== req.user.id)
    return next(
      new APIForbiddenError("FORBIDDEN", "You do not have permission to delete this comment")
    );

  await commentsService.deleteComment(comment);

  return res.sendStatus(204);
});

// get /:commentId/likes
// Get a comments like count
const getCommentLikes = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getCommentLikesSchema, req);

  const likes = await commentsService.getCommentLikes({ uuid: parsedRequest.params.commentId });

  return res.json({ likes });
});

// post /:commentId/likes
// Like a comment
const likeComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(likeCommentSchema, req);

  const likes = await commentsService.likeComment(
    { uuid: parsedRequest.params.commentId },
    req.user
  );

  return res.json({ likes });
});

// delete /:commentId/likes
// Unlike a comment
const unlikeComment = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(unlikeCommentSchema, req);

  const likes = await commentsService.unlikeComment(
    { uuid: parsedRequest.params.commentId },
    req.user
  );

  return res.json({ likes });
});

export {
  queryComments,
  createPostComment,
  getComment,
  editComment,
  deleteComment,
  getCommentLikes,
  likeComment,
  unlikeComment,
};
