import logger from "../logging";
import { APIBaseError, APIParameterError, APIServerError } from "../errors";
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
  }

  logger.error("Controller error handled", { error: error.error, errorMessage: error.message });
  return res.status(error.status).json(error.toJSON());
};

export default errorHandler;
