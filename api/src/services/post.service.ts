import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DATA_CONSTANTS, WEB_CONSTANTS } from "../config.js";
import prisma from "../database.js";
import { APIBadRequestError, APIConflictError, APINotFoundError } from "../errors.js";
import { managePrismaError } from "../errors.js";
import logger from "../logging.js";
import { uuid } from "../utils/strings.js";
import { getUserID } from "./user.service.js";
import type { Pagination, RequireKey, ID, UUID } from "../types.js";
import type { UniqueUser } from "./user.service.js";
import type { GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import type { Post, PostMedia, Prisma, User } from "@prisma/client";

const { MODERATION_OUTPUT_TABLE_NAME } = process.env;

const dynamoDBClient = new DynamoDB({});

type UniquePostKeys = { id: ID; uuid: UUID };
type UniquePost = RequireKey<UniquePostKeys> & Partial<Post>;
type PostWithMedia = Post & { media: PostMedia[] };

const postNotFound = new APINotFoundError(
  "POST_NOT_FOUND",
  "No post was found that matches the given criteria"
);

const unprocessedError = new APIBadRequestError(
  "PROCESSING",
  "The media requested has not finished processing"
);

interface ModerationResult {
  MEDIA_ID: string;
  IS_RESTRICTED: boolean;
  IS_BLOCKED: boolean;
  DETECTED_LABELS: string[];
}

const getMediaModeration = async (mediaUUID: string): Promise<ModerationResult | null> => {
  const getMediaModeration: GetItemCommandInput = {
    TableName: MODERATION_OUTPUT_TABLE_NAME,
    Key: {
      MEDIA_ID: { S: mediaUUID },
    },
  };

  try {
    const mediaResult = await dynamoDBClient.getItem(getMediaModeration);

    if (!mediaResult.Item) return null;

    const moderation = unmarshall(mediaResult.Item);
    return moderation as ModerationResult;
  } catch (error) {
    return null;
  }
};

const observeMedia = async (media: PostMedia) => {
  logger.debug(`Fetching moderation status for media ${media.uuid}`, {
    ID: "FETCH_MODERATION_START",
  });
  const moderation = await getMediaModeration(media.uuid);

  if (!moderation) {
    logger.debug(`Requested media not yet processed`, { ID: "OBSERVE_NOT_PROCESSED" });
    throw unprocessedError;
  }

  const newMedia = await prisma.postMedia.update({
    where: { id: media.id },
    data: {
      observed: true,
      blocked: moderation.IS_BLOCKED,
      restricted: moderation.IS_RESTRICTED,
    },
  });

  return newMedia;
};

const processPost = async (post: PostWithMedia): Promise<PostWithMedia> => {
  const unobserved: PostMedia[] = [];
  const observed: PostMedia[] = [];

  for (const media of post.media) {
    if (media.observed) {
      observed.push(media);
    } else {
      unobserved.push(media);
    }
  }

  const newMedia = await Promise.all(unobserved.map(observeMedia));

  return { ...post, media: observed.concat(newMedia), processed: true };
};

const getPost = async (post: UniquePost) => {
  try {
    const dbPost = await prisma.post.findUniqueOrThrow({
      where: {
        id: post.id,
        uuid: post.uuid,
      },
      include: {
        media: true,
      },
    });

    const observedPost = await processPost(dbPost);

    return observedPost;
  } catch (error) {
    return managePrismaError(error, postNotFound);
  }
};

const getPostID = async (post: UniquePost): Promise<Post["id"]> => {
  if (post.id) return post.id;
  const dbPost = await getPost(post);
  return dbPost.id;
};

interface QueryOptions extends Pagination {
  username?: string;
  caption?: string;
  orderBy?: "likes" | "postedAt";
  orderDirection?: "asc" | "desc";
}

const queryPosts = async (options: QueryOptions) => {
  const order = options.orderBy ?? "postedAt";
  const orderDirection = options.orderDirection ?? "desc";

  const orderQuery: Prisma.PostOrderByWithRelationInput = {};
  if (order === "likes") {
    orderQuery.likes = {
      _count: orderDirection,
    };
  } else if (order === "postedAt") {
    orderQuery.postedAt = orderDirection;
  }

  const posts = await prisma.post.findMany({
    where: {
      ...(options.username && {
        author: {
          username: {
            contains: options.username,
          },
        },
      }),
      ...(options.caption && {
        caption: {
          contains: options.caption,
        },
      }),
      processed: true,
    },
    include: {
      author: true,
      media: true,
    },
    orderBy: orderQuery,
    skip: options.from,
    take: options.count ?? DATA_CONSTANTS.PAGINATION_TAKE_DEFAULT,
  });

  return posts;
};

const getPostLikeCount = async (post: UniquePost) => {
  try {
    const count = await prisma.post.findUniqueOrThrow({
      where: { id: post.id, uuid: post.uuid },
      select: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return count._count.likes;
  } catch (error) {
    console.log(error);
    return managePrismaError(error, postNotFound);
  }
};

const hasUserLikedPost = async (post: UniquePost, user: UniqueUser) => {
  const postId = await getPostID(post);
  const userId = await getUserID(user);

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  return Boolean(existingLike);
};

const likePost = async (post: UniquePost, user: UniqueUser) => {
  const postId = await getPostID(post);
  const userId = await getUserID(user);

  const alreadyLiked = await hasUserLikedPost({ id: postId }, { id: userId });
  if (alreadyLiked)
    throw new APIConflictError("POST_ALREADY_LIKED", "You have already liked this post");

  const like = await prisma.postLike.create({
    data: {
      userId,
      postId,
      likedAt: new Date(),
    },
    include: {
      post: {
        select: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },
    },
  });

  return like.post._count.likes;
};

const unlikePost = async (post: UniquePost, user: UniqueUser) => {
  const postId = await getPostID(post);
  const userId = await getUserID(user);

  const isLiked = await hasUserLikedPost({ id: postId }, { id: userId });
  if (!isLiked) throw new APIBadRequestError("POST_NOT_LIKED", "You have not liked this post");

  const like = await prisma.postLike.delete({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
    include: {
      post: {
        select: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },
    },
  });

  return Math.max(like.post._count.likes - 1, 0);
};

const createPost = async (user: User, caption: string, mediaKeys: string[]) => {
  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      caption,
      postedAt: new Date(),
      uuid: uuid(),
    },
  });

  const media = await Promise.all(
    mediaKeys.map((key, index) =>
      prisma.postMedia.create({
        data: {
          uuid: key,
          url: `https://${WEB_CONSTANTS.MEDIA_SUBDOMAIN}.${WEB_CONSTANTS.DOMAIN}/${key}`,
          type: "image",
          index,
          postId: post.id,
        },
      })
    )
  );

  return { ...post, media };
};

const editPost = async (post: UniquePost, caption: string) => {
  const postId = await getPostID(post);

  const newPost = await prisma.post.update({
    where: { id: postId },
    data: { caption },
    include: { author: true, media: true },
  });

  return newPost;
};

const deletePost = async (post: UniquePost) => {
  const postId = await getPostID(post);

  await prisma.post.delete({ where: { id: postId } });
};

export {
  getPost,
  getPostID,
  queryPosts,
  getPostLikeCount,
  hasUserLikedPost,
  likePost,
  unlikePost,
  createPost,
  editPost,
  deletePost,
};
export type { UniquePost };
