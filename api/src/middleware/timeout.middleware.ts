import { APIServerError } from "../errors/api";
import type { Request, Response, NextFunction } from "express";

/**
 * Creates a middleware function to automatically reject a request if it takes too long
 *
 * @param time The amount of time in ms
 * @returns A middleware function
 */
const timeout = (time: number) => (req: Request, res: Response, next: NextFunction) => {
  const timeout = setTimeout(
    () =>
      next(new APIServerError("SERVER_TIMEOUT", "The server did not respond in a timely manner.")),
    time
  );
  res.on("finish", () => clearTimeout(timeout));
  next();
};

export default timeout;
