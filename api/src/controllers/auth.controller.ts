import { protect } from "../middleware/auth.middleware.js";
import { whoAmISchema } from "../schemas/auth.schemas.js";
import { privateUserFilterSchema } from "../schemas/users.schemas.js";
import { validate } from "../schemas/validation.js";
import { filter } from "../utils/objects.js";
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

// GET /whoami
// Return authenticated user
const whoAmI = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  await validate(whoAmISchema, req);

  return res.json(filter(req.user, privateUserFilterSchema));
});

export { whoAmI };
