import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIBadRequestError } from "../errors.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  createPostSchema,
  deletePostSchema,
  editPostSchema,
  getPostLikesSchema,
  getPostSchema,
  likePostSchema,
  queryPostsSchema,
  unlikePostSchema,
} from "../schemas/posts.schemas.js";
import { publicPostFilterSchema } from "../schemas/posts.schemas.js";
import { validate } from "../schemas/validation.js";
import * as postsService from "../services/post.service.js";
import { getUploadURL } from "../services/s3.service.js";
import { filter } from "../utils/objects.js";
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

const { MODERATION_OUTPUT_TABLE_NAME } = process.env;

const dynamoDBClient = new DynamoDB({});

// get /
// Query posts
const queryPosts = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(queryPostsSchema, req);

  const posts = await postsService.queryPosts({
    username: parsedRequest.query.username,
    caption: parsedRequest.query.caption,
    orderBy: parsedRequest.query["order-by"] === "posted-at" ? "postedAt" : "likes",
    orderDirection: parsedRequest.query["order-direction"],
    from: parsedRequest.query.from,
    count: parsedRequest.query.count,
  });

  return res.json(posts.map((post) => filter(post, publicPostFilterSchema)));
});

// post /
// Create a post
const createPost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(createPostSchema, req);

  const mediaURLs = await Promise.all(parsedRequest.body.media.map(getUploadURL));

  const post = await postsService.createPost(
    req.user,
    parsedRequest.body.caption,
    mediaURLs.map((media) => media.key)
  );

  return res.json({
    ...filter(post, publicPostFilterSchema),
    uploadURLs: mediaURLs,
  });
});

const processingError = new APIBadRequestError(
  "PROCESSING",
  "The requested post is still being processed"
);

// get /:postId
// Get a post
const getPost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getPostSchema, req);

  const post = await postsService.getPost({ uuid: parsedRequest.params.postId });

  // TODO: Move into service, save results in SQL

  const getMediaParams = {
    RequestItems: {
      [MODERATION_OUTPUT_TABLE_NAME]: {
        Keys: post.media.map((media) => ({
          MEDIA_ID: { S: media.uuid },
        })),
      },
    },
  };

  const mediaResult = await dynamoDBClient.batchGetItem(getMediaParams);

  if (!mediaResult.Responses) return next(processingError);

  const moderationResults = mediaResult.Responses[MODERATION_OUTPUT_TABLE_NAME].map((item) =>
    unmarshall(item)
  );

  return res.json({ ...filter(post, publicPostFilterSchema), moderation: moderationResults });
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

  const count = await postsService.getPostLikeCount({ uuid: parsedRequest.params.postId });

  return res.json({ likes: count });
});

// post /:postId/likes
// Like a post
const likePost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(likePostSchema, req);

  const likes = await postsService.likePost({ uuid: parsedRequest.params.postId }, req.user);

  return res.json({ likes });
});

// delete /:postId/likes
// Unlike a post
const unlikePost = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(unlikePostSchema, req);

  const likes = await postsService.unlikePost({ uuid: parsedRequest.params.postId }, req.user);

  return res.json({ likes });
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
};
