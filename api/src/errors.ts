import { Prisma } from "@prisma/client";
import { RUNTIME_CONSTANTS } from "./config.js";
import type { ZodIssue } from "zod";

class APIBaseError extends Error {
  error: string;
  status: number;

  constructor(error: string, message: string, status = 500) {
    super(message);

    this.error = error;
    this.status = status;
  }

  toJSON(): any {
    return {
      error: this.error,
      message: this.message,
      stack:
        RUNTIME_CONSTANTS.IS_DEV && this.stack
          ? this.stack.split("\n").map((line) => line.trim())
          : undefined,
    };
  }
}

class APIBadRequestError extends APIBaseError {
  constructor(error = "BAD_REQUEST", message = "Bad Request") {
    super(error, message, 400);
  }
}

class APIUnauthorizedError extends APIBaseError {
  constructor(
    error = "UNAUTHORIZED",
    message = "You must be authenticated to access to requested resource."
  ) {
    super(error, message, 401);
  }
}

class APIForbiddenError extends APIBaseError {
  constructor(error = "FORBIDDEN", message = "Access Denied") {
    super(error, message, 403);
  }
}

class APINotFoundError extends APIBaseError {
  constructor(error = "NOT_FOUND", message = "Not Found") {
    super(error, message, 404);
  }
}

class APIConflictError extends APIBaseError {
  constructor(error = "CONFLICT", message = "Conflict") {
    super(error, message, 409);
  }
}

class APIServerError extends APIBaseError {
  constructor(error = "INTERNAL_SERVER_ERROR", message = "Internal Server Error") {
    super(error, message, 500);
  }
}

export type BadParameter = { location: string; message: string; type: ZodIssue["code"] };

class APIParameterError extends APIBadRequestError {
  parameters: BadParameter[];

  constructor(parameters: BadParameter[]) {
    super("BAD_PARAMETERS", "One or more supplied parameters are invalid.");

    this.parameters = parameters;
  }

  toJSON(): any {
    return { ...super.toJSON(), parameters: this.parameters };
  }
}

const managePrismaError = (error: any, notFoundError: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    throw notFoundError;
  throw error;
};

export {
  APIBaseError,
  APIBadRequestError,
  APIUnauthorizedError,
  APIForbiddenError,
  APINotFoundError,
  APIConflictError,
  APIServerError,
  APIParameterError,
  managePrismaError,
};
