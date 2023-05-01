import { Router } from "express";
import { getSystemStatus } from "../controllers/system.controller";
import { validate } from "../middleware/validation.middleware";

const systemRouter = Router();

systemRouter.get("/status", getSystemStatus);

export default systemRouter;
