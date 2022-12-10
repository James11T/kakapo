import status from "http-status";

type APIResponse<T> = { data: T; response: Response };

interface AuthenticateResponse {
  refreshToken: string;
  user: AuthenticatedUser;
}

interface User {
  id: string;
  email: string;
}

interface AuthenticatedUser extends User {
  refreshToken: string;
}

class APIError {
  public type: string;
  constructor(type: string) {
    this.type = type;
  }

  isHTTP(): this is HTTPError {
    return this.type === "http";
  }

  isNetwork(): this is NetworkError {
    return this.type === "network";
  }

  public text() {
    return "Unknown error";
  }
}

class NetworkError extends APIError {
  public type = "network" as const;

  constructor() {
    super("network");
  }

  public text() {
    return "Unexpected network error";
  }
}

type HTTPErrorDetails = { error: string; [key: string]: any } | null;

class HTTPError extends APIError {
  public type = "http" as const;
  public code: number;
  public details: HTTPErrorDetails | null = null;

  constructor(code: number, details: HTTPErrorDetails | null = null) {
    super("http");

    this.code = code;
    this.details = details;
  }

  public text() {
    return `HTTP ${this.code}: ${status[this.code]}`;
  }
}

export { APIError, NetworkError, HTTPError };
export type { AuthenticateResponse, APIResponse, User, AuthenticatedUser };
