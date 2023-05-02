import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import authRouter from "./auth.route";
import postsRouter from "./posts.route";
import systemRouter from "./system.route";
import tokenRouter from "./tokens.route";
import usersRouter from "./users.route";

const baseRouter = Router();

baseRouter.use(authenticate);

baseRouter.use("/", systemRouter);
baseRouter.use("/tokens", tokenRouter);
baseRouter.use("/auth", authRouter);
baseRouter.use("/users", usersRouter);
baseRouter.use("/posts", postsRouter);

export default baseRouter;
