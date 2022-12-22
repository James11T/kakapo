import { Router } from "express";
import {
  queryPostsController,
  createPostController,
  getPostController,
  deletePostController,
  editPostController
} from "../controllers/posts.controller";
import fileUpload from "express-fileupload";
import { POST_CONSTANTS } from "../config";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createPostSchema } from "../validation/posts.validation";

const postsRouter = Router();

postsRouter.get("/", queryPostsController);
postsRouter.post(
  "/",
  protect,
  fileUpload({
    limits: {
      files: POST_CONSTANTS.MAX_MEDIA_COUNT,
      fileSize: POST_CONSTANTS.MAX_MEDIA_SIZE
    }
  }),
  validate(createPostSchema),
  createPostController
);

postsRouter.get("/:postId", getPostController);
postsRouter.delete("/:postId", deletePostController);
postsRouter.patch("/:postId", editPostController);

export default postsRouter;
