import { Router } from "express";
import systemRouter from "./system.route";
import tokenRouter from "./tokens.route";
import authRouter from "./auth.route";
import usersRouter from "./users.route";
import postsRouter from "./posts.route";
import { authenticate } from "../middleware/auth.middleware";

const baseRouter = Router();

baseRouter.use(authenticate);

baseRouter.use("/", systemRouter);
baseRouter.use("/tokens", tokenRouter);
baseRouter.use("/auth", authRouter);
baseRouter.use("/users", usersRouter);
baseRouter.use("/posts", postsRouter);

export default baseRouter;
