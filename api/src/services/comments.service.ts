import { DATA_CONSTANTS } from "../config.js";
import prisma from "../database.js";
import { APIBadRequestError, APIConflictError, APINotFoundError } from "../errors.js";
import { managePrismaError } from "../errors.js";
import { getPostID } from "./post.service.js";
import { getUserID } from "./user.service.js";
import type { UniquePost } from "./post.service.js";
import type { UniqueUser } from "./user.service.js";
import type { ID, RequireKey, Pagination, UUID } from "../types.js";
import type { Comment, Prisma } from "@prisma/client";

type UniqueCommentKeys = { id: ID; uuid: UUID };
type UniqueComment = RequireKey<UniqueCommentKeys> & Partial<Comment>;

const commentNotFound = new APINotFoundError(
  "COMMENT_NOT_FOUND",
  "No comment was found that matches the given criteria"
);

const getComment = async (
  comment: UniqueComment,
  options?: Omit<Prisma.CommentFindUniqueArgs, "where">
): Promise<Comment> => {
  const dbComment = await prisma.comment.findUnique({
    ...options,
    where: {
      ...comment,
    },
  });

  if (!dbComment) {
    throw commentNotFound;
  }

  return dbComment;
};

const getCommentID = async (comment: UniqueComment) => {
  if (comment.id) return comment.id;

  const dbComment = await getComment(comment);

  return dbComment.id;
};

const getCommentLikes = async (comment: UniqueComment) => {
  try {
    const count = await prisma.comment.findUniqueOrThrow({
      where: { ...comment },
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
    return managePrismaError(error, commentNotFound);
  }
};

interface QueryOptions extends Pagination {
  post: UniquePost;
}

const queryComments = async (options: QueryOptions) => {
  const id = await getPostID(options.post);
  const comments = await prisma.comment.findMany({
    where: {
      post: {
        id,
      },
    },
    skip: options.from,
    take: options.count ?? DATA_CONSTANTS.PAGINATION_TAKE_DEFAULT,
  });

  return comments;
};

const hasUserLikedComment = async (comment: UniqueComment, user: UniqueUser) => {
  const commentId = await getCommentID(comment);
  const userId = await getUserID(user);

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });

  return Boolean(existingLike);
};

const likeComment = async (comment: UniqueComment, user: UniqueUser) => {
  const commentId = await getCommentID(comment);
  const userId = await getUserID(user);

  const alreadyLiked = await hasUserLikedComment({ id: commentId }, { id: userId });
  if (alreadyLiked)
    throw new APIConflictError("COMMENT_ALREADY_LIKED", "You have already liked this comment");

  const like = await prisma.commentLike.create({
    data: {
      userId,
      commentId,
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

const unlikeComment = async (comment: UniqueComment, user: UniqueUser) => {
  const commentId = await getCommentID(comment);
  const userId = await getUserID(user);

  const isLiked = await hasUserLikedComment({ id: commentId }, { id: userId });
  if (!isLiked)
    throw new APIBadRequestError("COMMENT_NOT_LIKED", "You have not liked this comment");

  const like = await prisma.commentLike.delete({
    where: {
      commentId_userId: {
        commentId,
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

export { unlikeComment, getComment, getCommentID, getCommentLikes, queryComments, likeComment };
