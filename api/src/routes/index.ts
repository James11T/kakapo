import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import authRouter from "./auth.route.js";
import commentsRouter from "./comments.route.js";
import postsRouter from "./posts.route.js";
import systemRouter from "./system.route.js";
import tokenRouter from "./tokens.route.js";
import usersRouter from "./users.route.js";

const baseRouter = Router();

baseRouter.use(authenticate);

baseRouter.use("/", systemRouter);
baseRouter.use("/tokens", tokenRouter);
baseRouter.use("/auth", authRouter);
baseRouter.use("/users", usersRouter);
baseRouter.use("/posts", postsRouter);
baseRouter.use("/comments", commentsRouter);

export default baseRouter;
