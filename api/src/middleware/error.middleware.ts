import { APIBaseError } from "../errors/api";
import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error");

  if (err instanceof APIBaseError) {
    return res.status(err.status).json(err.toJSON());
  } else if (err instanceof SyntaxError) {
    // Usually when express.json fails
    return res.status(400).json({
      error: "The supplied data was malformed",
    });
  }

  return res
    .status(500)
    .json({ error: "UNEXPECTED_ERROR", message: "An unexpected server error ocurred." });
};

export default errorHandler;
