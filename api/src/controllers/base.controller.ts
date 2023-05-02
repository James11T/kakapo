import type { Handler, NextFunction, Request, Response } from "express";

const asyncController =
  (controller: Handler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(controller(req, res, next)).catch(next);
  };

export { asyncController };
