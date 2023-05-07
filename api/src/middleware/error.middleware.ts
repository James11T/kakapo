import { APIBaseError, APIParameterError, APIServerError } from "../errors.js";
import logger from "../logging.js";
import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error: APIBaseError;

  if (err instanceof APIBaseError) {
    error = err;
  } else if (err instanceof SyntaxError) {
    // Usually when express.json fails
    const newError = new APIParameterError([
      {
        location: "body",
        message: "Not valid json",
        type: "invalid_string",
      },
    ]);

    error = newError;
  } else {
    error = new APIServerError();
    logger.error("Uncaught error handled", { error: String(err) });
  }

  logger.debug(String(err));
  return res.status(error.status).json(error.toJSON());
};

export default errorHandler;
