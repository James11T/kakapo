import { Router } from "express";
import authRouter from "./auth.route";
import likesRouter from "./likes.route";
import usersRouter from "./users.route";
import postsRouter from "./posts.route";
import tokenRouter from "./tokens.route";
import statusRouter from "./status.route";
import settingsRouter from "./settings.route";
import commentsRouter from "./comments.route";
import friendRequestsRouter from "./friendRequests.route";
import { authenticate } from "../middleware/auth.middleware";

const baseRouter = Router();

baseRouter.use(authenticate);

baseRouter.use("/status", statusRouter);
baseRouter.use("/auth", authRouter);
baseRouter.use("/tokens", tokenRouter);
baseRouter.use("/comments", commentsRouter);
baseRouter.use("/likes", likesRouter);
baseRouter.use("/posts", postsRouter);
baseRouter.use("/settings", settingsRouter);
baseRouter.use("/users", usersRouter);
baseRouter.use("/friend-requests", friendRequestsRouter);

export default baseRouter;
