import status from "http-status";

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
}

interface AuthenticatedUser extends User {
  refreshToken: string;
}

interface AuthenticateResponse {
  refreshToken: string;
  user: AuthenticatedUser;
}

interface CreateUserResponse {
  id: string;
}

interface StatusResponse {
  status: string;
  version: string;
  country: string;
  memoryUsage?: string;
}

interface RequestConfig {
  body?: any;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  timeout: number;
  baseUrl: string;
  artificialLatency: number;
}

type BaseConfig = Omit<RequestConfig, "body" | "method">;

type MethodlessConfig = Omit<RequestConfig, "method">;
type BodylessConfig = Omit<MethodlessConfig, "body">;

class APISuccess<T> {
  readonly data: T;
  readonly response: Response;
  readonly ok = true;
  readonly err = false;

  constructor(data: T, response: Response) {
    this.data = data;
    this.response = response;
  }
}

class NetworkError {
  public readonly details: string;
  public readonly network = true;
  public readonly http = false;
  public readonly ok = false;
  public readonly err = true;

  constructor(details: string) {
    this.details = details;
  }

  public text(): string {
    return "Unexpected network error";
  }
}

type HTTPErrorDetails = { error: string; [key: string]: any } | null;

class HTTPError {
  public readonly code: number;
  public readonly details: HTTPErrorDetails = null;
  public readonly network = false;
  public readonly http = true;
  public readonly ok = false;
  public readonly err = true;

  constructor(code: number, details: HTTPErrorDetails = null) {
    this.code = code;
    this.details = details;
  }

  public text(): string {
    return `HTTP ${this.code}: ${status[this.code]}`;
  }
}

type APIResponse<T> = APISuccess<T> | HTTPError | NetworkError;

export { NetworkError, HTTPError, APISuccess };
export type {
  AuthenticateResponse,
  User,
  AuthenticatedUser,
  APIResponse,
  StatusResponse,
  CreateUserResponse,
  MethodlessConfig,
  BodylessConfig,
  RequestConfig,
  BaseConfig
};
