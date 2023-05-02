import { Router } from "express";
import { getSystemStatus } from "../controllers/system.controller";

const systemRouter = Router();

systemRouter.get("/status", getSystemStatus);

export default systemRouter;
